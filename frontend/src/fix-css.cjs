const fs = require('fs');

let css = fs.readFileSync('index.css', 'utf8');

const correctTop = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

@import "tailwindcss";

@theme {
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-heading: 'Poppins', system-ui, -apple-system, sans-serif;
  
  --color-primary: #82b53f;
  --color-primary-hover: #6c9834;
  --color-secondary: #3B82F6;
  --color-success: #82b53f;
  --color-danger: #DC2626;
  --color-dark: #1F2937;
  --color-muted: #6B7280;
  --color-bg: #F8FAFC;
  --color-border: #E5E7EB;

  --shadow-primary: 0 4px 14px 0 rgba(15, 157, 140, 0.25);
  --shadow-card: 0 8px 30px rgba(0, 0, 0, 0.04);
  --shadow-card-hover: 0 12px 40px rgba(15, 157, 140, 0.1);
  
  --animate-fade-in: fadeIn 0.5s ease-out forwards;
  --animate-fade-in-up: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  --animate-float: float 6s ease-in-out infinite;
  --animate-slide-right: slideRight 0.8s ease-out forwards;
  --animate-heart-beat: heartBeat 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;

  @keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
  @keyframes fadeInUp {
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-15px); }
  }
  @keyframes slideRight {
    0% { opacity: 0; transform: translateX(-40px); }
    100% { opacity: 1; transform: translateX(0); }
  }
  @keyframes heartBeat {
    0% { transform: scale(1); }
    50% { transform: scale(1.3); }
    100% { transform: scale(1); }
  }
}

:root {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  --bg: #EEF2F8;
  --surface: #FFFFFF;
  --surface-alt: #F5F8FC;
  --primary: #1D4E93;
  --primary-light: #DCE7F8;
  --success: #1D9A6C;
  --success-light: #DFF4EA;
  --warning: #C98A1B;
  --warning-light: #FBF0D8;
  --danger: #CF3F3F;
  --danger-light: #FBE2E2;
  --text: #182233;
  --text-muted: #64707F;
  --text-faint: #96A1AE;
  --border: #E3E8F1;
  --sidebar-bg: #0D1A2E;
  --accent: #2DD4BF;
}

body {
  width: 100%;
  max-width: 100vw;
  margin: 0;
  padding: 0;
  overflow-x: clip;
  background-color: var(--color-bg);
  color: var(--color-dark);
}

#root {
  width: 100%;
  max-width: 100vw;
  overflow-x: clip;
}

@layer base {
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
    color: var(--color-dark);
  }
}

@layer components {
  /* Cards */
  .app-card {
    background-color: #FFFFFF;
    border: 1px solid var(--color-border);
    border-radius: 0.75rem;
    box-shadow: var(--shadow-card);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  }
  
  .app-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-card-hover);
    border-color: rgba(15, 157, 140, 0.2);
  }

  .glass-card {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.6);
    border-radius: 0.75rem;
    box-shadow: var(--shadow-card);
  }
`;

// Find where /* Inputs */ starts
const marker = '  /* Inputs */';
const splitIndex = css.indexOf(marker);

if (splitIndex === -1) {
  console.log("Could not find inputs marker");
} else {
  const rest = css.slice(splitIndex);
  fs.writeFileSync('index.css', correctTop + '\n' + rest);
  console.log("Fixed successfully.");
}
