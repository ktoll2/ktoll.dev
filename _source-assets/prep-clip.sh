#!/usr/bin/env bash
# Prepare blog-post clips: downscale to the size and encoding used across the
# site's posts and extract the poster still that _includes/post-video.html expects.
#
# Usage:
#   _source-assets/prep-clip.sh [-o OUT_DIR] [-t STILL_SECONDS] [-c CRF] input.mp4...
#
# For each input NAME.mp4 this writes:
#   OUT_DIR/NAME.mp4        480x270 H.264 (Main, yuv420p), ~23.976 fps, no audio, faststart
#   OUT_DIR/NAME-still.jpg  480x270 poster frame taken from the source at STILL_SECONDS
#
# OUT_DIR defaults to each input's own directory. When that means replacing the
# input, the original is first moved to $HOME/.cache/site-assets/originals/ so
# the full-size source is never lost.
set -euo pipefail

WIDTH=480
HEIGHT=270
FPS="24000/1001"

out_dir=""
still_time="1"
crf="28"

usage() {
  echo "usage: prep-clip.sh [-o OUT_DIR] [-t STILL_SECONDS] [-c CRF] input.mp4..." >&2
  exit 2
}

while getopts "o:t:c:h" opt; do
  case "$opt" in
    o) out_dir=$OPTARG ;;
    t) still_time=$OPTARG ;;
    c) crf=$OPTARG ;;
    *) usage ;;
  esac
done
shift $((OPTIND - 1))
[ "$#" -ge 1 ] || usage
command -v ffmpeg >/dev/null 2>&1 || { echo "prep-clip.sh: ffmpeg is not installed" >&2; exit 1; }

backup_dir="$HOME/.cache/site-assets/originals"
work_dir=$(mktemp -d)
trap 'rm -rf "$work_dir"' EXIT

for input in "$@"; do
  [ -f "$input" ] || { echo "prep-clip.sh: input not found: $input" >&2; exit 1; }

  in_abs="$(cd "$(dirname "$input")" && pwd)/$(basename "$input")"
  name=$(basename "$input")
  name=${name%.*}
  dest_dir=${out_dir:-$(dirname "$in_abs")}
  mkdir -p "$dest_dir"
  dest_dir=$(cd "$dest_dir" && pwd)
  dest_video="$dest_dir/$name.mp4"
  dest_still="$dest_dir/$name-still.jpg"

  # Encode and extract from the untouched source into a temp dir first, so a
  # failed run never leaves a half-written file next to the post.
  ffmpeg -v error -y -i "$in_abs" -an \
    -vf "scale=$WIDTH:$HEIGHT" -r "$FPS" \
    -c:v libx264 -profile:v main -pix_fmt yuv420p -crf "$crf" -preset slow \
    -movflags +faststart "$work_dir/$name.mp4"
  ffmpeg -v error -y -ss "$still_time" -i "$in_abs" -frames:v 1 \
    -vf "scale=$WIDTH:$HEIGHT" -q:v 4 "$work_dir/$name-still.jpg"

  if [ "$dest_video" = "$in_abs" ]; then
    mkdir -p "$backup_dir"
    mv "$in_abs" "$backup_dir/$name.$(date +%Y%m%d%H%M%S).mp4"
  fi
  mv "$work_dir/$name.mp4" "$dest_video"
  mv "$work_dir/$name-still.jpg" "$dest_still"

  echo "$name: $(stat -c %s "$dest_video") bytes video, $(stat -c %s "$dest_still") bytes still -> $dest_dir"
done
