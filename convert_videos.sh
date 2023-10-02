#!/bin/bash

SOURCE_DIR="downloads"

find "$SOURCE_DIR" -type f -name '*.mkv' | while read -r file; do
  OUTPUT_FILE="${file%.mkv}.mp4"
  echo "Converting $file to $OUTPUT_FILE"
  ffmpeg -i "$file" -codec:v libx264 -codec:a aac "$OUTPUT_FILE"
  rm "$file"
done
