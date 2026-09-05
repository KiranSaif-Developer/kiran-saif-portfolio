// ===================================================================
// PUBLISHED CERTIFICATIONS — the list every visitor actually sees.
// Update whenever you finalize certifications in the admin panel:
// Export JSON -> copy the "portfolio_certs" array -> paste it here -> push.
//
// NOTE: fixed 3 data issues from the last export before publishing:
// 1. cert-ChatGPT-meta and cert-data-preparation-specialist had their
//    "image" paths swapped (ChatGPT cert pointed to the Excel image, and
//    vice versa) — corrected below.
// 2. cert-wordpress-architect had a filename ("wordpress-development.jpg")
//    sitting in the "title" field instead of a real title — corrected.
// 3. cert-ChatGPT-meta had a filename sitting in the "category" field
//    instead of an actual category — corrected to "ai".
// ===================================================================

const PUBLISHED_CERTIFICATIONS = [
  {
    "id": "cert-ChatGPT-meta",
    "title": "Introduction to ChatGPT",
    "issuer": "DataCamp",
    "category": "ai",
    "date": "June 4, 2024",
    "keySkills": [
      "ChatGPT",
      "Prompt Engineering",
      "AI Tools",
      "Generative AI",
      "Effective Prompting"
    ],
    "verifyLink": "",
    "image": "images/certificates/introduction-chatgpt.jpg"
  },
  {
    "id": "cert-wordpress-architect",
    "title": "WordPress Development",
    "issuer": "",
    "category": "wordpress",
    "date": "February 2, 2024",
    "keySkills": [
      "Theme Architecture",
      "WooCommerce",
      "Plugin Development"
    ],
    "verifyLink": "",
    "image": "images/certificates/wordpress-development.jpg"
  },
  {
    "id": "cert-data-preparation-specialist",
    "title": "Data Preparation in Excel",
    "issuer": "DataCamp",
    "category": "excel",
    "date": "June 4, 2024",
    "keySkills": [
      "Excel",
      "Data Cleaning",
      "Logical Functions",
      "Nested Formulas",
      "VLOOKUP",
      "PivotTables",
      "Data Preparation"
    ],
    "verifyLink": "",
    "image": "images/certificates/data-preparation-excel.jpg"
  }
];
