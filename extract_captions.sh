#!/bin/bash

SOURCE_DIR="downloads"

find "$SOURCE_DIR" -type f \( -name '*.mp4' -o -name '*.mkv' \) | while read -r file; do
  map_lines=$(ffmpeg -hide_banner -i "$file" 2>&1 | grep -oP 'Stream #\d+:\d+\(\w+\): Subtitle: \w+')
  
  if [ -z "$map_lines" ]; then
    echo "No subtitles found in $file"
    continue
  fi
  
  echo "Extracting subtitles from $file"
  echo "$map_lines" | while read -r line; do
    stream_map=$(echo $line | grep -oP 'Stream #\K\d+:\d+')
    OUTPUT_FILE="${file%.*}_$(echo $line | grep -oP '\(\K\w+').srt"
    
    if [ -f "$OUTPUT_FILE" ]; then
      echo "$OUTPUT_FILE already exists"
    else
      echo "Extracting $stream_map to $OUTPUT_FILE"
      ffmpeg -hide_banner -i "$file" -map "$stream_map" "$OUTPUT_FILE"
    fi
  done
done
