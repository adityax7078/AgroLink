# AgroLink AI Prompt Evaluation & Engineering Log (`PROMPTS.md`)

This document presents the systematic prompt engineering process, prompt variations tested, input/output samples, selection rationale, and system role context used in **AgroLink's AgroAI Agricultural Specialist Service** (powered by Google Gemini 1.5 Flash).

---

## 1. System Prompt & Persona

```text
System Context / Role Instruction:
"You are AgroAI, an expert senior agronomist, plant pathologist, and agricultural scientist specialized in crop farming in India. Provide clear, highly actionable, science-based diagnostic guidance, treatment protocols, and yield retention projections tailored for smallholder farmers and agricultural processors."
```

---

## 2. Tested Prompt Variations

### Variation 1: Basic Direct Prompt (Unstructured)

#### Prompt Structure:
```text
Diagnose crop problem: Wheat crop has yellow spots on leaves. Tell me what to do.
```

#### Example Input:
- **Crop**: Wheat
- **Query**: "Wheat crop has yellow spots on leaves."

#### Example Output:
```text
The yellow spots on your wheat leaves could be wheat rust or nitrogen deficiency. You should spray fungicide like Mancozeb and apply urea fertilizer. Also check for insects in your field.
```

#### Evaluation:
- **Pros**: Quick generation, simple.
- **Cons**: Vague, lacks structured actionable steps, missing confidence level, urgency indicator, or regional context.

---

### Variation 2: Structured Persona & JSON Format Prompt

#### Prompt Structure:
```text
System Role: Senior Plant Pathologist
Task: Analyze crop query for Wheat in Punjab during Rabi season on Alluvial soil.
Farmer Symptom: Yellow spots appearing on upper leaves with slight wilting during early morning.

Return response as JSON with fields:
- diagnosis (string)
- urgency (High / Moderate / Low)
- confidenceScore (percentage)
- actionSteps (array of strings)
- recommendedTreatment (string)
- yieldImpact (string)
```

#### Example Input:
- **Crop**: Wheat
- **Location**: Punjab, India
- **Query**: "Yellow spots appearing on upper leaves with slight wilting during early morning."

#### Example Output:
```json
{
  "diagnosis": "Early Stripe Rust (Puccinia striiformis) & Nitrogen Deficit",
  "urgency": "High (Act within 48 hours)",
  "confidenceScore": "94.8%",
  "actionSteps": [
    "Foliar spray of Propiconazole 25% EC @ 1ml/L water.",
    "Ensure balanced potassium application to improve stress tolerance.",
    "Monitor relative humidity and canopy airflow."
  ],
  "recommendedTreatment": "Propiconazole 25% EC or Tebuconazole 50% + Trifloxystrobin 25% WG.",
  "yieldImpact": "Timely application saves 85-95% expected harvest yield."
}
```

#### Evaluation:
- **Pros**: Clean JSON parsing for frontend rendering, concise, includes clear urgency and action steps.
- **Cons**: Can sound slightly clinical without narrative explanation.

---

### Variation 3: Few-Shot Chain-of-Thought (CoT) Expert Agricultural Prompt (Selected Best)

#### Prompt Structure:
```text
System Context: You are AgroAI, an expert senior agronomist, plant pathologist, and agricultural scientist. Provide clear, highly actionable, science-based guidance tailored for farmers and agricultural processors in India.

Context:
- Crop: Wheat (Kanak)
- Location: Punjab, India
- Season: Rabi (Winter)
- Soil Type: Alluvial Soil
- Symptom / Issue: Yellow spots appearing on upper leaves with slight wilting during early morning.

Chain-of-Thought Diagnostic Process:
1. Identify primary fungal vs bacterial vs nutrient deficiency indicators based on season and region.
2. Determine urgency and infection stage.
3. Formulate step-by-step mitigation (cultural, biological, chemical).
4. Estimate yield recovery potential.

Output Requirements: Provide a concise diagnosis, urgency level, confidence score, detailed agronomic analysis, 4 step-by-step action items, exact chemical/bio spray dosage, and yield impact projection.
```

#### Example Input:
- **Crop**: Wheat
- **Location**: Punjab, India
- **Season**: Rabi
- **Soil Type**: Alluvial
- **Query**: "Yellow spots appearing on upper leaves with slight wilting during early morning."

#### Example Output:
```text
Primary Diagnosis: Early Stripe Rust (Puccinia striiformis) compounded by early-stage Nitrogen (N) chlorosis.
Urgency: High (Act within 48 hours)
Confidence: 96%

Agronomic Analysis:
The appearance of yellow pustules aligned along leaf veins during the cold, humid Rabi season in Punjab strongly indicates Stripe Rust. Cold morning dew combined with Alluvial soil nitrogen leaching promotes rapid spore germination.

Action Plan:
1. Apply foliar spray of Propiconazole 25% EC @ 200ml in 200L water per acre.
2. Avoid excess irrigation to reduce canopy humidity.
3. Apply top-dressing of Neem-coated Urea (25kg/acre) after spray.
4. Scout adjacent fields within 500m radius.

Recommended Spray: Propiconazole 25% EC @ 1ml/L water or Mancozeb 75% WP @ 2g/L.
Yield Impact Projection: Immediate treatment restores 90-95% yield potential.
```

---

## 3. Which Prompt Worked Best & Rationale

**Selection**: **Variation 3 (Few-Shot Chain-of-Thought Expert Agricultural Prompt)** was selected as the optimal prompt for production integration.

**Rationale (3-4 Sentences)**:
Variation 3 consistently delivered the highest precision and practical utility for agricultural users by enforcing a step-by-step reasoning path before generating conclusions. Incorporating specific regional context (such as soil type, seasonal microclimates, and local crop variants) eliminated generic recommendations and ensured actionable spray dosages. Furthermore, structuring the output into distinct visual fields allowed our React frontend component (`AIAdvisor.jsx`) to render rich diagnostic cards, urgency badges, and step-by-step action plans cleanly.
