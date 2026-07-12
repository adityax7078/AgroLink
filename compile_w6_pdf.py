import os
from PIL import Image, ImageDraw, ImageFont

def draw_caption(img_path, caption_text, output_path):
    try:
        # Open source image
        im = Image.open(img_path)
        w, h = im.size
        
        # Create a new image with extra height for caption
        extra_h = 100
        new_im = Image.new("RGB", (w, h + extra_h), (255, 255, 255))
        
        # Paste original image
        new_im.paste(im, (0, 0))
        
        # Draw text caption at the bottom
        draw = ImageDraw.Draw(new_im)
        
        # Use default font (or try to load a simple standard one)
        font = None
        try:
            font = ImageFont.truetype("arial.ttf", 20)
        except Exception:
            font = ImageFont.load_default()
            
        # Draw word wrap for long captions
        words = caption_text.split()
        lines = []
        current_line = []
        for word in words:
            test_line = " ".join(current_line + [word])
            if hasattr(draw, "textbbox"):
                bbox = draw.textbbox((0, 0), test_line, font=font)
                line_w = bbox[2] - bbox[0]
            else:
                line_w, _ = draw.textsize(test_line, font=font)
                
            if line_w < w - 80:
                current_line.append(word)
            else:
                lines.append(" ".join(current_line))
                current_line = [word]
        lines.append(" ".join(current_line))
        
        # Draw each line centered
        y_cursor = h + 15
        for line in lines:
            if hasattr(draw, "textbbox"):
                bbox = draw.textbbox((0, 0), line, font=font)
                lw = bbox[2] - bbox[0]
                lh = bbox[3] - bbox[1]
            else:
                lw, lh = draw.textsize(line, font=font)
            lx = (w - lw) // 2
            draw.text((lx, y_cursor), line, fill=(15, 23, 42), font=font)
            y_cursor += lh + 6
        
        new_im.save(output_path)
        print(f"Caption added successfully: {caption_text[:50]}...")
        return True
    except Exception as e:
        print(f"Error drawing caption for {img_path}: {e}")
        return False

def compile_pdf():
    screenshots = [
        ("w6_register_form.png", "w6_register_form_captioned.png", 
         "Figure 1: AgroLink Marketplace - Registration Form. Users can provide an email address, enter a secure password, verify the password, select their marketplace role (Farmer / Processor), and submit details to create a new marketplace portal account."),
        
        ("w6_register_success.png", "w6_register_success_captioned.png", 
         "Figure 2: AgroLink Marketplace - Registration Success Response. The backend registers the user, hashes the plain password using bcryptjs (10 salt rounds) before storing it in MySQL, and returns a clean HTTP 201 response. The frontend displays a success toast and switches back to Sign In mode."),
        
        ("w6_login_form.png", "w6_login_form_captioned.png", 
         "Figure 3: AgroLink Marketplace - Portal Login Form. The registered user inputs their login email, password, and matching marketplace role. Submission triggers a POST request to /api/auth/login, validated by a Zod schema."),
        
        ("w6_login_success.png", "w6_login_success_captioned.png", 
         "Figure 4: AgroLink Marketplace - Successful Login. The backend validates credentials, signs a secure JWT using JWT_SECRET (valid for 7 days), and returns it to the frontend. The frontend stores it in localStorage and grants access to the main marketplace."),
        
        ("w6_unauthorized_redirect.png", "w6_unauthorized_redirect_captioned.png", 
         "Figure 5: AgroLink Marketplace - Protected Route Guard Redirect. An unauthenticated user attempts to bypass login by directly navigating to /dashboard. The frontend route guard detects the missing JWT token and redirects the browser back to /login."),
        
        ("w6_rate_limit_error.png", "w6_rate_limit_error_captioned.png", 
         "Figure 6: AgroLink Marketplace - Rate Limit 429 Error. The backend implements express-rate-limit to protect auth endpoints. When a client floods /api/auth/login with more than 5 attempts, the server rejects with HTTP 429. The frontend displays an error toast."),
         
        ("w6_oauth_consent.png", "w6_oauth_consent_captioned.png", 
         "Figure 7: AgroLink Marketplace - Simulated Google/GitHub OAuth Consent Screen. When client credentials are not specified, the backend presents a styled consent screen allowing the tester to input their OAuth email and role before approving authorization."),
         
        ("w6_oauth_success.png", "w6_oauth_success_captioned.png", 
         "Figure 8: AgroLink Marketplace - Successful OAuth Authorization. Upon authorization approval, the callback fetches/registers the OAuth user, creates a signed JWT, redirects back to the SPA, and logs the user directly into the dashboard.")
    ]
    
    captioned_images = []
    temp_files = []
    
    print("Drawing captions on authentication screenshots...")
    for raw, captioned, caption in screenshots:
        if not os.path.exists(raw):
            print(f"Error: Raw screenshot {raw} does not exist. Run node backend/capture_w6.js first.")
            return False
            
        success = draw_caption(raw, caption, captioned)
        if success:
            captioned_images.append(captioned)
            temp_files.append(raw)
            temp_files.append(captioned)
            
    pdf_name = "W6_AuthFlowScreenshots_26101094.pdf"
    print(f"Compiling captioned screenshots into {pdf_name}...")
    
    try:
        images = []
        for file in captioned_images:
            if os.path.exists(file):
                im = Image.open(file).convert("RGB")
                images.append(im)
            else:
                print(f"Warning: Image file {file} is missing.")
                
        if not images:
            print("Error: No images were available for compilation.")
            return False
            
        # Save images as a multi-page PDF
        images[0].save(pdf_name, save_all=True, append_images=images[1:])
        print(f"PDF generated successfully at: {os.path.abspath(pdf_name)}")
        
        # Clean up temporary PNG files
        print("Cleaning up temporary files...")
        for file in temp_files:
            if os.path.exists(file):
                os.remove(file)
                
        return True
    except Exception as e:
        print(f"Error compiling PDF: {e}")
        return False

if __name__ == "__main__":
    compile_pdf()
