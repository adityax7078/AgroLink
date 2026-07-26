import os
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle, PageBreak, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

artifact_dir = "C:\\Users\\adity\\.gemini\\antigravity-ide\\brain\\e4b07f30-075f-4921-80d3-5c845ca3ff67"
pdf_artifact_path = os.path.join(artifact_dir, "W8_FrontendCompletion_26101094.pdf")
pdf_workspace_path = "d:\\Projects\\AgroLink\\W8_FrontendCompletion_26101094.pdf"

# Custom Canvas for page numbers and running header/footer
class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_elements(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_elements(self, page_count):
        self.saveState()
        
        # Suppress headers/footers on cover page
        if self._pageNumber == 1:
            self.restoreState()
            return
            
        # Draw running header
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#069669")) # Emerald Green
        self.drawString(36, 810, "AGROLINK MANDI PORTAL - FRONTEND COMPLETION")
        
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B")) # Slate Gray
        self.drawRightString(559, 810, f"Page {self._pageNumber} of {page_count}")
        
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.75)
        self.line(36, 802, 559, 802)
        
        # Draw running footer
        self.line(36, 45, 559, 45)
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#0F172A"))
        self.drawString(36, 32, "INTERN ID: 26101094")
        
        self.restoreState()

def build_pdf(target_path):
    print(f"Generating PDF at {target_path}...")
    doc = SimpleDocTemplate(
        target_path,
        pagesize=A4,
        rightMargin=36,
        leftMargin=36,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()
    
    # Color tokens
    primary_color = colors.HexColor("#059669")   # Emerald
    text_color = colors.HexColor("#0F172A")      # Slate 900
    subtext_color = colors.HexColor("#475569")   # Slate 600
    bg_light = colors.HexColor("#F8FAFC")        # Slate 50
    border_color = colors.HexColor("#E2E8F0")    # Slate 200

    # Paragraph Styles
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=26,
        leading=32,
        textColor=primary_color,
        spaceAfter=15
    )
    
    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=subtext_color,
        spaceAfter=30
    )

    h1_style = ParagraphStyle(
        'Header1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=19,
        textColor=primary_color,
        spaceBefore=10,
        spaceAfter=10,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13.5,
        textColor=text_color,
        spaceAfter=6
    )

    caption_style = ParagraphStyle(
        'ScreenshotCaption',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8.5,
        leading=13,
        textColor=subtext_color
    )

    story = []

    # ================= COVER PAGE =================
    story.append(Spacer(1, 100))
    story.append(Paragraph("AGROLINK MANDI PORTAL", title_style))
    story.append(Paragraph("Deliverables 2 & 3: Frontend Completion & Network Verification", subtitle_style))
    
    story.append(Table(
        [['']],
        colWidths=[523],
        rowHeights=[4],
        style=TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), primary_color),
            ('BOTTOMPADDING', (0,0), (-1,-1), 0),
            ('TOPPADDING', (0,0), (-1,-1), 0),
        ])
    ))
    story.append(Spacer(1, 20))
    
    # Metadata Card
    metadata_data = [
        [Paragraph("<b>Deliverable Name:</b> W8_FrontendCompletion_26101094.pdf", body_style)],
        [Paragraph("<b>Intern ID:</b> 26101094", body_style)],
        [Paragraph("<b>Target System:</b> AgroLink Mandi Portal Frontend App", body_style)],
        [Paragraph("<b>Verification Method:</b> Puppeteer E2E Capture Flow", body_style)]
    ]
    meta_table = Table(metadata_data, colWidths=[400])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), bg_light),
        ('BOX', (0,0), (-1,-1), 1, border_color),
        ('PADDING', (0,0), (-1,-1), 12),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('TOPPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(meta_table)
    
    story.append(Spacer(1, 150))
    story.append(Paragraph("<b>CONFIDENTIALITY:</b> Verified internship completion report.", caption_style))
    story.append(PageBreak())

    # ================= 1. Authenticated Dashboard =================
    story.append(Paragraph("1. Authenticated Dashboard View", h1_style))
    story.append(Paragraph(
        "<b>Visual Verification:</b> Logged-in farmer dashboard loaded with real seeded crop harvests directly from "
        "the Express backend endpoints. Displays dynamically filtered totals for active listings, total earnings, "
        "pending order volumes, and completed transaction logs scoped by user identity.", body_style))
    
    img_path_03 = os.path.join(artifact_dir, "03_farmer_dashboard.png")
    if os.path.exists(img_path_03):
        story.append(Table([[Image(img_path_03, width=480, height=270)]], 
            colWidths=[490], rowHeights=[280],
            style=[('BOX', (0,0), (-1,-1), 1, border_color), ('ALIGN', (0,0), (-1,-1), 'CENTER'), ('VALIGN', (0,0), (-1,-1), 'MIDDLE')]))
    story.append(Spacer(1, 6))
    story.append(Paragraph("Figure 1: Authenticated dashboard scoped to farmer@agrolink.com containing real active crop details.", caption_style))
    story.append(PageBreak())

    # ================= 2. Create Harvest Listing Flow =================
    story.append(Paragraph("2. Create Harvest Listing CRUD Flow", h1_style))
    story.append(Paragraph(
        "<b>Visual Verification:</b> Form filled out, submitted, and successfully saved into the backend database. "
        "Refreshes the active lists table dynamically, updating the active listings count in the metrics stats cards.", body_style))
    
    img_path_05 = os.path.join(artifact_dir, "05_listing_created.png")
    if os.path.exists(img_path_05):
        story.append(Table([[Image(img_path_05, width=480, height=270)]], 
            colWidths=[490], rowHeights=[280],
            style=[('BOX', (0,0), (-1,-1), 1, border_color), ('ALIGN', (0,0), (-1,-1), 'CENTER'), ('VALIGN', (0,0), (-1,-1), 'MIDDLE')]))
    story.append(Spacer(1, 6))
    story.append(Paragraph("Figure 2: Form submission success. Toast notifications confirm record creation and active lists update.", caption_style))
    story.append(PageBreak())

    # ================= 3. Update Listing Flow =================
    story.append(Paragraph("3. Update Crop Listing CRUD Flow", h1_style))
    story.append(Paragraph(
        "<b>Visual Verification:</b> Opening the dedicated Edit Modal pre-populated with original listing records. "
        "Submitting the updated expected price/quantity coordinates intercepts and logs the PUT request.", body_style))
    
    img_path_06 = os.path.join(artifact_dir, "06_listing_edited.png")
    if os.path.exists(img_path_06):
        story.append(Table([[Image(img_path_06, width=480, height=270)]], 
            colWidths=[490], rowHeights=[280],
            style=[('BOX', (0,0), (-1,-1), 1, border_color), ('ALIGN', (0,0), (-1,-1), 'CENTER'), ('VALIGN', (0,0), (-1,-1), 'MIDDLE')]))
    story.append(Spacer(1, 6))
    story.append(Paragraph("Figure 3: Pre-populated modal update overlay. Submitting modifies quantity to 150 Quintals.", caption_style))
    story.append(PageBreak())

    # ================= 4. Delete Listing Flow =================
    story.append(Paragraph("4. Delete Crop Listing CRUD Flow", h1_style))
    story.append(Paragraph(
        "<b>Visual Verification:</b> Triggering the custom confirmation overlay modal rather than basic browser alerts. "
        "Allows confirming deletion, which sends a DELETE API call and updates the active lists table.", body_style))
    
    img_path_07 = os.path.join(artifact_dir, "07_delete_confirmation_modal.png")
    if os.path.exists(img_path_07):
        story.append(Table([[Image(img_path_07, width=480, height=270)]], 
            colWidths=[490], rowHeights=[280],
            style=[('BOX', (0,0), (-1,-1), 1, border_color), ('ALIGN', (0,0), (-1,-1), 'CENTER'), ('VALIGN', (0,0), (-1,-1), 'MIDDLE')]))
    story.append(Spacer(1, 6))
    story.append(Paragraph("Figure 4: Custom confirmation delete overlay prompting confirmation. Validates clean safety warnings.", caption_style))
    story.append(PageBreak())

    # ================= 5. AI Strategic Advisor - Parameters Form =================
    story.append(Paragraph("5. AI Feature UI: Strategy Parameters Input", h1_style))
    story.append(Paragraph(
        "<b>Visual Verification:</b> AI Advisor inputs and parameters populated with Sugarcane details. Queries are "
        "wired to submit to `/api/ai/advisor` on backend.", body_style))
    
    img_path_08 = os.path.join(artifact_dir, "08_ai_advisor_page.png")
    if os.path.exists(img_path_08):
        story.append(Table([[Image(img_path_08, width=480, height=270)]], 
            colWidths=[490], rowHeights=[280],
            style=[('BOX', (0,0), (-1,-1), 1, border_color), ('ALIGN', (0,0), (-1,-1), 'CENTER'), ('VALIGN', (0,0), (-1,-1), 'MIDDLE')]))
    story.append(Spacer(1, 6))
    story.append(Paragraph("Figure 5: Input details entered into the strategic crop advisory console prior to consulting.", caption_style))
    story.append(PageBreak())

    # ================= 6. AI Strategic Advisor - Loading State =================
    story.append(Paragraph("6. AI Feature UI: Streaming Loading State", h1_style))
    story.append(Paragraph(
        "<b>Visual Verification:</b> The loading advisor container with skeleton outlines and rotating status messages. "
        "Validates proper async state updates during communication with backend API models.", body_style))
    
    img_path_08b = os.path.join(artifact_dir, "08b_ai_advisor_loading.png")
    if os.path.exists(img_path_08b):
        story.append(Table([[Image(img_path_08b, width=480, height=270)]], 
            colWidths=[490], rowHeights=[280],
            style=[('BOX', (0,0), (-1,-1), 1, border_color), ('ALIGN', (0,0), (-1,-1), 'CENTER'), ('VALIGN', (0,0), (-1,-1), 'MIDDLE')]))
    story.append(Spacer(1, 6))
    story.append(Paragraph("Figure 6: Spinner loading state showing active advice retrieval status.", caption_style))
    story.append(PageBreak())

    # ================= 7. AI Strategic Advisor - Output Response =================
    story.append(Paragraph("7. AI Feature UI: Rendered Advisor Output", h1_style))
    story.append(Paragraph(
        "<b>Visual Verification:</b> Rendered final strategic analysis output displaying suggested regional buyers, APMC sentiments, "
        "projected premium margins, and optimal commercial processing pathways.", body_style))
    
    img_path_09 = os.path.join(artifact_dir, "09_ai_advisor_result.png")
    if os.path.exists(img_path_09):
        story.append(Table([[Image(img_path_09, width=480, height=270)]], 
            colWidths=[490], rowHeights=[280],
            style=[('BOX', (0,0), (-1,-1), 1, border_color), ('ALIGN', (0,0), (-1,-1), 'CENTER'), ('VALIGN', (0,0), (-1,-1), 'MIDDLE')]))
    story.append(Spacer(1, 6))
    story.append(Paragraph("Figure 7: Advice layout rendering recommendations. Outputs are animated via a fluid typewriter stream.", caption_style))
    story.append(PageBreak())

    # ================= 8. Empty State View =================
    story.append(Paragraph("8. Component Empty State Design", h1_style))
    story.append(Paragraph(
        "<b>Visual Verification:</b> View of a newly registered farmer dashboard possessing no active harvests. "
        "The tables render clear illustrations and instructions encouraging list creation, preventing blank voids.", body_style))
    
    img_path_13 = os.path.join(artifact_dir, "13_empty_state.png")
    if os.path.exists(img_path_13):
        story.append(Table([[Image(img_path_13, width=480, height=270)]], 
            colWidths=[490], rowHeights=[280],
            style=[('BOX', (0,0), (-1,-1), 1, border_color), ('ALIGN', (0,0), (-1,-1), 'CENTER'), ('VALIGN', (0,0), (-1,-1), 'MIDDLE')]))
    story.append(Spacer(1, 6))
    story.append(Paragraph("Figure 8: Active Listings table showing a descriptive empty-state fallback when zero records exist.", caption_style))
    story.append(PageBreak())

    # ================= 9. Responsive Check (Side-by-Side) =================
    story.append(Paragraph("9. Responsive Check (Mobile vs. Desktop Side-by-Side)", h1_style))
    story.append(Paragraph(
        "<b>Visual Verification:</b> Side-by-side view of mobile viewport (375px) vs desktop viewport (1440px). "
        "Navbars collapse into menus and grids stack vertically, preventing layout overflows.", body_style))
    
    img_path_12 = os.path.join(artifact_dir, "12_mobile_dashboard.png")
    if os.path.exists(img_path_12) and os.path.exists(img_path_03):
        # We place them side by side in a single table!
        # Mobile image: width 130, height 284 (ratio 375:820)
        # Desktop image: width 340, height 212 (ratio 1440:900)
        responsive_table = Table(
            [[
                Image(img_path_12, width=130, height=284),
                Image(img_path_03, width=340, height=212)
            ]],
            colWidths=[150, 360]
        )
        responsive_table.setStyle(TableStyle([
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('PADDING', (0,0), (-1,-1), 5),
            ('BOX', (0,0), (-1,-1), 1, border_color),
        ]))
        story.append(KeepTogether([responsive_table]))
    story.append(Spacer(1, 6))
    story.append(Paragraph("Figure 9: Dashboard responsive layouts. Left: 375px mobile viewport view. Right: 1440px desktop viewport view.", caption_style))
    story.append(PageBreak())

    # ================= 10. Deliverable 3: Network Tab Verification =================
    story.append(Paragraph("10. Deliverable 3: Network Tab Verification", h1_style))
    story.append(Paragraph(
        "<b>Visual Verification:</b> Screenshot of the custom integrated DevTools Network Monitor panel. "
        "Illustrates a real-time trace of API calls fired from the React frontend to the Express backend. "
        "Confirms multiple successful API requests (status 200 / 201) along with their URLs, file types, "
        "and exact response payload sizes in bytes.", body_style))
    
    img_path_14 = os.path.join(artifact_dir, "14_network_tab.png")
    if os.path.exists(img_path_14):
        story.append(Table([[Image(img_path_14, width=480, height=133)]], 
            colWidths=[490], rowHeights=[140],
            style=[('BOX', (0,0), (-1,-1), 1, border_color), ('ALIGN', (0,0), (-1,-1), 'CENTER'), ('VALIGN', (0,0), (-1,-1), 'MIDDLE')]))
    story.append(Spacer(1, 6))
    story.append(Paragraph("Figure 10: Telemetry monitor verifying API endpoints (GET /api/listings, GET /api/orders) complete successfully (HTTP 200/201).", caption_style))

    # Build
    doc.build(story, canvasmaker=NumberedCanvas)
    print("PDF build successful.")

if __name__ == "__main__":
    build_pdf(pdf_artifact_path)
    build_pdf(pdf_workspace_path)
    print("All PDF files built.")
