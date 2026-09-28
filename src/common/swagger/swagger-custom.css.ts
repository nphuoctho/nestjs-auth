/**
 * Vercel-inspired theme for Swagger UI: monochrome black/white surfaces,
 * Vercel blue accent, sharp 1px borders, Geist-style font stack.
 * Dark mode is driven by `html[data-theme="dark"]`, toggled by
 * `swagger-dark-mode.script.ts` and persisted in localStorage.
 *
 * `!important` is required on a few rules: swagger-ui's own stylesheet
 * ships per-method selectors like `.opblock.opblock-post
 * .opblock-summary-method` (4 class selectors) which outrank our
 * 2-class overrides regardless of source order.
 */
export const swaggerCustomCss = `
:root {
  --sw-bg: #ffffff;
  --sw-bg-subtle: #fafafa;
  --sw-fg: #000000;
  --sw-fg-muted: #666666;
  --sw-border: #eaeaea;
  --sw-accent: #0070f3;
  --sw-accent-fg: #ffffff;
  --sw-success: #0070f3;
  --sw-success-bg: #f0f7ff;
  --sw-danger: #e00;
  --sw-danger-bg: #fff0f0;
  --sw-warn: #f5a623;
  --sw-warn-bg: #fffaf0;
  --sw-code-bg: #fafafa;
  --sw-radius: 6px;
  --sw-font: Geist, Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --sw-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}

html[data-theme='dark'] {
  --sw-bg: #000000;
  --sw-bg-subtle: #0a0a0a;
  --sw-fg: #ededed;
  --sw-fg-muted: #888888;
  --sw-border: #333333;
  --sw-accent: #3291ff;
  --sw-accent-fg: #000000;
  --sw-success: #3291ff;
  --sw-success-bg: #0c1e2e;
  --sw-danger: #ff5555;
  --sw-danger-bg: #2e0c0c;
  --sw-warn: #f5a623;
  --sw-warn-bg: #2e230c;
  --sw-code-bg: #0a0a0a;
}

html, body {
  background: var(--sw-bg);
  transition: background 0.15s ease;
}

.swagger-ui {
  font-family: var(--sw-font);
  color: var(--sw-fg);
  background: var(--sw-bg);
}

.swagger-ui .topbar {
  background: var(--sw-bg);
  border-bottom: 1px solid var(--sw-border);
  padding: 10px 20px;
}
.swagger-ui .topbar .download-url-wrapper,
.swagger-ui .topbar-wrapper img,
.swagger-ui .topbar-wrapper .link {
  display: none;
}

.swagger-ui .info { margin: 32px 0; }
.swagger-ui .info .title {
  color: var(--sw-fg);
  font-weight: 600;
  letter-spacing: -0.02em;
}
.swagger-ui .info .description,
.swagger-ui .info p,
.swagger-ui .info li {
  color: var(--sw-fg-muted);
}
.swagger-ui .info a { color: var(--sw-accent); }

.swagger-ui .scheme-container {
  background: var(--sw-bg-subtle);
  border: 1px solid var(--sw-border);
  border-radius: var(--sw-radius);
  box-shadow: none;
}

.swagger-ui .opblock,
.swagger-ui .opblock.opblock-post,
.swagger-ui .opblock.opblock-get,
.swagger-ui .opblock.opblock-put,
.swagger-ui .opblock.opblock-patch,
.swagger-ui .opblock.opblock-delete {
  background: var(--sw-bg) !important;
  border: 1px solid var(--sw-border) !important;
  border-radius: var(--sw-radius);
  box-shadow: none;
  margin: 0 0 12px;
}
.swagger-ui .opblock .opblock-summary {
  border-color: var(--sw-border);
}
.swagger-ui .opblock .opblock-summary-description {
  color: var(--sw-fg-muted);
}
.swagger-ui .opblock .opblock-summary-path,
.swagger-ui .opblock .opblock-summary-path__deprecated {
  color: var(--sw-fg);
  font-family: var(--sw-mono);
}
.swagger-ui .opblock-tag {
  color: var(--sw-fg);
  border-bottom: 1px solid var(--sw-border);
}
.swagger-ui .opblock-tag:hover { background: var(--sw-bg-subtle); }

.swagger-ui .opblock.opblock-post { border-left: 3px solid var(--sw-accent) !important; }
.swagger-ui .opblock.opblock-get { border-left: 3px solid var(--sw-success) !important; }
.swagger-ui .opblock.opblock-delete { border-left: 3px solid var(--sw-danger) !important; }
.swagger-ui .opblock.opblock-patch,
.swagger-ui .opblock.opblock-put { border-left: 3px solid var(--sw-warn) !important; }

.swagger-ui .opblock-summary-method,
.swagger-ui .opblock.opblock-post .opblock-summary-method,
.swagger-ui .opblock.opblock-get .opblock-summary-method,
.swagger-ui .opblock.opblock-put .opblock-summary-method,
.swagger-ui .opblock.opblock-patch .opblock-summary-method,
.swagger-ui .opblock.opblock-delete .opblock-summary-method {
  border-radius: 4px;
  font-family: var(--sw-mono);
  background: var(--sw-fg) !important;
  color: var(--sw-bg) !important;
  text-shadow: none !important;
}

.swagger-ui .btn {
  border-radius: var(--sw-radius);
  border: 1px solid var(--sw-border);
  color: var(--sw-fg);
  background: var(--sw-bg);
  box-shadow: none;
  font-family: var(--sw-font);
}
.swagger-ui .btn:hover { border-color: var(--sw-fg); }
.swagger-ui .btn.authorize {
  background: var(--sw-fg);
  color: var(--sw-bg);
  border-color: var(--sw-fg);
}
.swagger-ui .btn.authorize svg { fill: var(--sw-bg); }
.swagger-ui .btn.execute {
  background: var(--sw-accent);
  color: var(--sw-accent-fg);
  border-color: var(--sw-accent);
}

.swagger-ui select,
.swagger-ui input[type='text'],
.swagger-ui input[type='password'],
.swagger-ui textarea {
  background: var(--sw-bg);
  color: var(--sw-fg);
  border: 1px solid var(--sw-border);
  border-radius: var(--sw-radius);
}

.swagger-ui table thead tr th,
.swagger-ui table thead tr td {
  color: var(--sw-fg-muted);
  border-bottom: 1px solid var(--sw-border);
}
.swagger-ui .parameter__name { color: var(--sw-fg); }
.swagger-ui .parameter__type { color: var(--sw-fg-muted); }

.swagger-ui .responses-inner,
.swagger-ui .response-col_status { color: var(--sw-fg); }
.swagger-ui .response-col_status .response-undocumented { color: var(--sw-fg-muted); }

.swagger-ui .highlight-code,
.swagger-ui pre.microlight,
.swagger-ui .body-param__example {
  background: var(--sw-code-bg) !important;
  border: 1px solid var(--sw-border);
  border-radius: var(--sw-radius);
  color: var(--sw-fg);
  font-family: var(--sw-mono);
}

.swagger-ui .model-box,
.swagger-ui section.models {
  background: var(--sw-bg);
  border: 1px solid var(--sw-border);
  border-radius: var(--sw-radius);
}
.swagger-ui section.models.is-open h4 {
  border-bottom: 1px solid var(--sw-border);
  color: var(--sw-fg);
}
.swagger-ui .model-title { color: var(--sw-fg); }
.swagger-ui .model { color: var(--sw-fg-muted); }

.swagger-ui .dialog-ux .modal-ux {
  background: var(--sw-bg);
  border: 1px solid var(--sw-border);
  border-radius: var(--sw-radius);
}
.swagger-ui .dialog-ux .modal-ux-header h3 { color: var(--sw-fg); }
.swagger-ui .dialog-ux .modal-ux-content { color: var(--sw-fg-muted); }

#swagger-theme-toggle {
  position: fixed;
  top: 12px;
  right: 20px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-family: var(--sw-font);
  font-size: 13px;
  font-weight: 500;
  color: var(--sw-fg);
  background: var(--sw-bg);
  border: 1px solid var(--sw-border);
  border-radius: 999px;
  cursor: pointer;
  transition: border-color 0.15s ease;
}
#swagger-theme-toggle:hover { border-color: var(--sw-fg); }
`;
