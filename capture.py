import subprocess
import os
import time
from PIL import Image

def capture_screenshots():
    edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
    
    # Check if edge path exists
    if not os.path.exists(edge_path):
        print(f"Error: Microsoft Edge not found at {edge_path}")
        return False
        
    base_url = "http://localhost:5174"
    
    # Output images mapping
    screenshots = [
        # (name, url_path, width, height)
        ("mobile_light", "/dashboard?theme=light", 375, 1600),
        ("tablet_light", "/dashboard?theme=light", 768, 1500),
        ("desktop_light", "/dashboard?theme=light", 1440, 1200),
        ("desktop_dark", "/dashboard?theme=dark", 1440, 1200),
    ]

    
    temp_files = []
    
    print("Starting screenshot captures using headless Edge...")
    for name, path, w, h in screenshots:
        url = f"{base_url}{path}"
        output_file = f"{name}.png"
        temp_files.append(output_file)
        
        print(f"Capturing {name} ({w}x{h}) from {url}...")
        
        # Chromium screenshot command line
        cmd = [
            edge_path,
            "--headless",
            "--disable-gpu",
            "--hide-scrollbars",
            f"--window-size={w},{h}",
            f"--screenshot={os.path.abspath(output_file)}",
            "--virtual-time-budget=2000",
            url
        ]
        
        try:
            # Run Edge headless. We wait for it to complete.
            subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            # Give a small buffer time
            time.sleep(1)
        except Exception as e:
            print(f"Error capturing {name}: {e}")
            return False
            
    # Compile into PDF
    pdf_name = "W3_ResponsiveScreenshots_26101094.pdf"
    print(f"Compiling screenshots into {pdf_name}...")
    
    try:
        images = []
        for file in temp_files:
            if os.path.exists(file):
                im = Image.open(file).convert("RGB")
                images.append(im)
            else:
                print(f"Warning: Screenshot file {file} is missing.")
                
        if not images:
            print("Error: No images were captured.")
            return False
            
        # Save images as a multi-page PDF
        images[0].save(pdf_name, save_all=True, append_images=images[1:])
        print(f"PDF generated successfully at: {os.path.abspath(pdf_name)}")
        
        # Clean up temporary files
        print("Cleaning up temporary PNG files...")
        for file in temp_files:
            if os.path.exists(file):
                os.remove(file)
                
        return True
    except Exception as e:
        print(f"Error compiling PDF: {e}")
        return False

if __name__ == "__main__":
    success = capture_screenshots()
    if success:
        print("Automation run completed successfully!")
    else:
        print("Automation run encountered errors.")
