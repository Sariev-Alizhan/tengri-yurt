#!/bin/bash

# Script to create placeholder images for accessories
# Requires ImageMagick: brew install imagemagick

ACCESSORIES_DIR="public/images/accessories"
WIDTH=800
HEIGHT=600

# Array of accessory IDs
accessories=(
  "shanyrak"
  "uyk"
  "kerege"
  "esik"
  "tundik"
  "uzik"
  "tuyrlyq"
  "tuskiyz"
  "ot-kilem"
  "ak-baskur"
  "ak-kyzyl-baular"
  "ayir-bau"
  "zhel-bau"
  "shashak"
  "shanyrak-ashekeyi"
  "chekhol"
  "bas-bel-arkandar"
  "bakan"
  "shalma-bau"
)

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "ImageMagick is not installed. Install it with: brew install imagemagick"
    exit 1
fi

echo "Creating placeholder images for accessories..."

for accessory in "${accessories[@]}"; do
  output_file="${ACCESSORIES_DIR}/${accessory}.jpg"
  
  # Skip if file already exists
  if [ -f "$output_file" ]; then
    echo "Skipping $accessory - file already exists"
    continue
  fi
  
  # Create a simple placeholder with beige background and text
  convert -size ${WIDTH}x${HEIGHT} \
    xc:'#7A6A54' \
    -gravity center \
    -pointsize 40 \
    -fill white \
    -annotate +0+0 "${accessory}" \
    "$output_file"
  
  echo "✓ Created placeholder for $accessory"
done

echo "Done! Created placeholder images in $ACCESSORIES_DIR"
