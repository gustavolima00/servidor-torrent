#!/bin/bash

SOURCE_DIR="downloads"

# Converte todos os arquivos .srt para .vtt e remove os arquivos .srt
find "$SOURCE_DIR" -type f -name '*.srt' | while read -r file; do
  OUTPUT_FILE="${file%.srt}.vtt"
  echo "Converting $file to $OUTPUT_FILE"
  ffmpeg -i "$file" "$OUTPUT_FILE" && rm "$file"
done
