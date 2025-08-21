#!/usr/bin/env node

/**
 * Zaawansowany System Diagnostyczno-Raportujący dla Projektu Stefano
 * Wykonuje pełną diagnostykę, walidację i generuje raporty
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

class StefanoDiagnostics {
  constructor() {
    this.results = {
      errors: [],
      warnings: [],
      stats: {},
      files: [],
      dependencies: {},
      security: []
    };
    this.startTime = Date.now();
  }

  log(message, type = 'info') {
    const colors = {
      info: '\x1b[36m',
      success: '\x1b[32m', 
      warning: '\x1b[33m',
      error: '\x1b[31m',
      reset: '\x1b[0m'
    };
    console.log(`${colors[type]}[DIAGNOSTYKA] ${message}${colors.reset}`);
  }

  // 1. Pełna diagnostyka projektu
  async runFullDiagnostics() {
    this.log('🔍 Rozpoczynam pełną diagnostykę projektu Stefano...', 'info');
    
    await this.validateSyntax();
    await this.checkDependencies();
    await this.scanForRuntimeErrors();
    await this.securityAudit();
    await this.performanceCheck();
    await this.collectProjectStats();
  }

  // Walidacja składni wszystkich plików
  async validateSyntax() {
    this.log('📝 Walidacja składni plików...', 'info');
    
    // TypeScript/JavaScript validation
    try {
      const tscOutput = execSync('npx tsc --noEmit --skipLibCheck', { encoding: 'utf8', stdio: 'pipe' });
      this.log('✅ TypeScript: Brak błędów składni', 'success');
    } catch (error) {
      const errorOutput = error.stdout || error.stderr || error.message || '';
      const errors = errorOutput.split('\n').filter(line => line.includes('error'));
      errors.forEach(errorLine => {
        this.results.errors.push({
          type: 'TypeScript',
          message: errorLine.trim(),
          file: errorLine.match(/([^(]+)\(/)?.[1] || 'Unknown',
          line: errorLine.match(/\((\d+),/)?.[1] || 'Unknown'
        });
      });
      this.log(`❌ TypeScript: ${errors.length} błędów składni`, 'error');
    }

    // ESLint validation
    try {
      execSync('npx eslint . --ext .ts,.tsx,.js,.jsx --format compact', { stdio: 'pipe' });
      this.log('✅ ESLint: Kod zgodny ze standardami', 'success');
    } catch (error) {
      const warnings = error.stdout.split('\n').filter(line => line.includes('warning') || line.includes('error'));
      warnings.forEach(warning => {
        this.results.warnings.push({
          type: 'ESLint',
          message: warning.trim()
        });
      });
      this.log(`⚠️ ESLint: ${warnings.length} ostrzeżeń`, 'warning');
    }

    // CSS validation (basic check)
    this.scanDirectory('.', ['.css']).forEach(cssFile => {
      try {
        const content = fs.readFileSync(cssFile, 'utf8');
        const braces = (content.match(/\{/g) || []).length - (content.match(/\}/g) || []).length;
        if (braces !== 0) {
          this.results.errors.push({
            type: 'CSS',
            message: 'Niezbalansowane nawiasy klamrowe',
            file: cssFile
          });
        }
      } catch (error) {
        this.results.errors.push({
          type: 'CSS',
          message: `Błąd odczytu pliku: ${error.message}`,
          file: cssFile
        });
      }
    });
  }

  // Sprawdzenie zależności
  async checkDependencies() {
    this.log('📦 Sprawdzanie zależności...', 'info');
    
    try {
      const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
      this.results.dependencies = {
        total: Object.keys(packageJson.dependencies || {}).length + Object.keys(packageJson.devDependencies || {}).length,
        production: Object.keys(packageJson.dependencies || {}).length,
        development: Object.keys(packageJson.devDependencies || {}).length
      };

      // Check for outdated packages
      try {
        const outdated = execSync('npm outdated --json', { encoding: 'utf8' });
        const outdatedPackages = JSON.parse(outdated);
        Object.keys(outdatedPackages).forEach(pkg => {
          this.results.warnings.push({
            type: 'Dependency',
            message: `Przestarzały pakiet: ${pkg} (current: ${outdatedPackages[pkg].current}, latest: ${outdatedPackages[pkg].latest})`
          });
        });
      } catch (error) {
        // No outdated packages or npm outdated failed
      }

      this.log(`✅ Zależności: ${this.results.dependencies.total} pakietów`, 'success');
    } catch (error) {
      this.results.errors.push({
        type: 'Dependencies',
        message: `Błąd sprawdzania zależności: ${error.message}`
      });
    }
  }

  // Skanowanie błędów runtime
  async scanForRuntimeErrors() {
    this.log('🔍 Skanowanie potencjalnych błędów runtime...', 'info');
    
    const jsFiles = this.scanDirectory('.', ['.ts', '.tsx', '.js', '.jsx']);
    
    jsFiles.forEach(file => {
      if (file.includes('node_modules')) return;
      
      try {
        const content = fs.readFileSync(file, 'utf8');
        
        // Check for common runtime error patterns
        const patterns = [
          { pattern: /console\.error/g, type: 'Console Error', severity: 'warning' },
          { pattern: /throw new Error/g, type: 'Explicit Error', severity: 'info' },
          { pattern: /\.catch\s*\(\s*\)/g, type: 'Empty Catch Block', severity: 'warning' },
          { pattern: /undefined/g, type: 'Undefined Reference', severity: 'warning' },
          { pattern: /null\./g, type: 'Potential Null Reference', severity: 'error' }
        ];

        patterns.forEach(({ pattern, type, severity }) => {
          const matches = content.match(pattern);
          if (matches) {
            const target = severity === 'error' ? this.results.errors : this.results.warnings;
            target.push({
              type: 'Runtime',
              message: `${type}: ${matches.length} wystąpień`,
              file: file.replace('./', '')
            });
          }
        });
      } catch (error) {
        // Skip files that can't be read
      }
    });
  }

  // Audit bezpieczeństwa
  async securityAudit() {
    this.log('🔒 Audit bezpieczeństwa...', 'info');
    
    try {
      execSync('npm audit --audit-level moderate', { stdio: 'pipe' });
      this.log('✅ Bezpieczeństwo: Brak krytycznych luk', 'success');
    } catch (error) {
      try {
        const auditOutput = execSync('npm audit --json', { encoding: 'utf8' });
        const audit = JSON.parse(auditOutput);
        
        if (audit.vulnerabilities) {
          Object.values(audit.vulnerabilities).forEach(vuln => {
            this.results.security.push({
              name: vuln.name,
              severity: vuln.severity,
              via: vuln.via
            });
          });
        }
      } catch (jsonError) {
        this.results.warnings.push({
          type: 'Security',
          message: 'Nie można przeprowadzić pełnego auditu bezpieczeństwa'
        });
      }
    }

    // Check for hardcoded secrets
    const sensitivePatterns = [
      { pattern: /sk_live_[a-zA-Z0-9]+/, name: 'Stripe Live Key' },
      { pattern: /pk_live_[a-zA-Z0-9]+/, name: 'Stripe Public Key' },
      { pattern: /password\s*[=:]\s*['"'][^'"']+['"']/i, name: 'Hardcoded Password' },
      { pattern: /api[_-]?key\s*[=:]\s*['"'][^'"']+['"']/i, name: 'API Key' }
    ];

    this.scanDirectory('.', ['.ts', '.tsx', '.js', '.jsx']).forEach(file => {
      if (file.includes('node_modules') || file.includes('.git')) return;
      
      try {
        const content = fs.readFileSync(file, 'utf8');
        sensitivePatterns.forEach(({ pattern, name }) => {
          if (pattern.test(content)) {
            this.results.security.push({
              type: 'Hardcoded Secret',
              name: name,
              file: file.replace('./', '')
            });
          }
        });
      } catch (error) {
        // Skip files that can't be read
      }
    });
  }

  // Test wydajności
  async performanceCheck() {
    this.log('⚡ Sprawdzanie wydajności...', 'info');
    
    try {
      // Check bundle size (approximate)
      const clientFiles = this.scanDirectory('./client/src', ['.ts', '.tsx']);
      let totalSize = 0;
      
      clientFiles.forEach(file => {
        try {
          const stats = fs.statSync(file);
          totalSize += stats.size;
        } catch (error) {
          // Skip
        }
      });

      this.results.stats.bundleSize = Math.round(totalSize / 1024); // KB
      
      if (totalSize > 1000000) { // > 1MB
        this.results.warnings.push({
          type: 'Performance',
          message: `Duży rozmiar bundle: ${Math.round(totalSize / 1024)}KB`
        });
      }

      this.log(`📊 Rozmiar kodu źródłowego: ${Math.round(totalSize / 1024)}KB`, 'info');
    } catch (error) {
      this.results.warnings.push({
        type: 'Performance',
        message: `Nie można sprawdzić rozmiaru bundle: ${error.message}`
      });
    }
  }

  // Zbieranie statystyk projektu
  async collectProjectStats() {
    this.log('📊 Zbieranie statystyk projektu...', 'info');
    
    const allFiles = this.scanDirectory('.', []);
    const codeFiles = this.scanDirectory('.', ['.ts', '.tsx', '.js', '.jsx', '.css', '.html']);
    
    let totalLines = 0;
    let totalSize = 0;
    
    codeFiles.forEach(file => {
      if (file.includes('node_modules')) return;
      
      try {
        const content = fs.readFileSync(file, 'utf8');
        const stats = fs.statSync(file);
        
        totalLines += content.split('\n').length;
        totalSize += stats.size;
        
        this.results.files.push({
          path: file.replace('./', ''),
          size: stats.size,
          lines: content.split('\n').length,
          modified: stats.mtime.toISOString()
        });
      } catch (error) {
        // Skip files that can't be read
      }
    });

    this.results.stats = {
      ...this.results.stats,
      totalFiles: allFiles.length,
      codeFiles: codeFiles.length,
      totalLines,
      totalSize: Math.round(totalSize / 1024), // KB
      projectStructure: this.generateProjectTree()
    };
  }

  // Generowanie drzewa projektu
  generateProjectTree() {
    const tree = {};
    
    const addToTree = (filePath, obj) => {
      const parts = filePath.split('/');
      let current = obj;
      
      parts.forEach((part, index) => {
        if (!current[part]) {
          current[part] = index === parts.length - 1 ? 'file' : {};
        }
        if (typeof current[part] === 'object') {
          current = current[part];
        }
      });
    };

    this.results.files.forEach(file => {
      addToTree(file.path, tree);
    });

    return tree;
  }

  // Skanowanie katalogów
  scanDirectory(dir, extensions = []) {
    const files = [];
    
    const scan = (currentDir) => {
      try {
        const items = fs.readdirSync(currentDir);
        items.forEach(item => {
          if (item.startsWith('.') && item !== '.replit' && item !== '.env') return;
          
          const fullPath = path.join(currentDir, item);
          try {
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory() && item !== 'node_modules' && !item.startsWith('.git')) {
              scan(fullPath);
            } else if (stat.isFile()) {
              if (extensions.length === 0 || extensions.some(ext => item.endsWith(ext))) {
                files.push(fullPath);
              }
            }
          } catch (error) {
            // Skip files with permission issues
          }
        });
      } catch (error) {
        // Skip directories with permission issues
      }
    };
    
    scan(dir);
    return files;
  }

  // 2. Generowanie szczegółowego raportu
  generateDetailedReport() {
    this.log('📋 Generowanie szczegółowego raportu...', 'info');
    
    const reportContent = `
=====================================================
SZCZEGÓŁOWY RAPORT DIAGNOSTYCZNY - PROJEKT STEFANO
=====================================================
Data generacji: ${new Date().toLocaleString('pl-PL')}
Czas wykonania: ${Math.round((Date.now() - this.startTime) / 1000)}s

=====================================================
1. PODSUMOWANIE WYKONAWCZE
=====================================================
Łączna liczba plików: ${this.results.stats.totalFiles}
Pliki kodu źródłowego: ${this.results.stats.codeFiles}
Łączna liczba linii kodu: ${this.results.stats.totalLines}
Rozmiar projektu: ${this.results.stats.totalSize}KB
Zależności: ${this.results.dependencies.total} pakietów

Status projektu: ${this.results.errors.length === 0 ? '✅ GOTOWY DO PRODUKCJI' : '⚠️ WYMAGA POPRAWEK'}

=====================================================
2. BŁĘDY KRYTYCZNE (${this.results.errors.length})
=====================================================
${this.results.errors.length === 0 ? 'Brak błędów krytycznych.' : 
  this.results.errors.map((error, index) => 
    `${index + 1}. [${error.type}] ${error.message}
   Plik: ${error.file || 'N/A'}
   Linia: ${error.line || 'N/A'}`
  ).join('\n\n')}

=====================================================
3. OSTRZEŻENIA I SUGESTIE (${this.results.warnings.length})
=====================================================
${this.results.warnings.length === 0 ? 'Brak ostrzeżeń.' :
  this.results.warnings.map((warning, index) =>
    `${index + 1}. [${warning.type}] ${warning.message}`
  ).join('\n')}

=====================================================
4. ANALIZA BEZPIECZEŃSTWA
=====================================================
${this.results.security.length === 0 ? 'Brak problemów z bezpieczeństwem.' :
  this.results.security.map((issue, index) =>
    `${index + 1}. ${issue.type || 'Vulnerability'}: ${issue.name}
   Poziom: ${issue.severity || 'Unknown'}
   ${issue.file ? `Plik: ${issue.file}` : ''}`
  ).join('\n\n')}

=====================================================
5. STATYSTYKI ZALEŻNOŚCI
=====================================================
Pakiety produkcyjne: ${this.results.dependencies.production}
Pakiety deweloperskie: ${this.results.dependencies.development}
Łącznie: ${this.results.dependencies.total}

=====================================================
6. NAJWIĘKSZE PLIKI
=====================================================
${this.results.files
  .sort((a, b) => b.size - a.size)
  .slice(0, 10)
  .map((file, index) => 
    `${index + 1}. ${file.path} (${Math.round(file.size / 1024)}KB, ${file.lines} linii)`
  ).join('\n')}

=====================================================
7. REKOMENDACJE
=====================================================
${this.generateRecommendations().join('\n')}

=====================================================
8. STRUKTURA PROJEKTU
=====================================================
${this.formatProjectTree(this.results.stats.projectStructure)}

Raport wygenerowany automatycznie przez System Diagnostyczno-Raportujący Stefano
`;

    fs.writeFileSync('RAPORT.txt', reportContent, 'utf8');
    this.log('✅ Raport zapisany jako RAPORT.txt', 'success');
  }

  // Generowanie rekomendacji
  generateRecommendations() {
    const recommendations = [];
    
    if (this.results.errors.length > 0) {
      recommendations.push('• Napraw wszystkie błędy krytyczne przed wdrożeniem');
    }
    
    if (this.results.warnings.length > 5) {
      recommendations.push('• Rozważ naprawienie ostrzeżeń dla lepszej jakości kodu');
    }
    
    if (this.results.security.length > 0) {
      recommendations.push('• Usuń wszystkie problemy bezpieczeństwa');
    }
    
    if (this.results.stats.bundleSize > 500) {
      recommendations.push('• Rozważ optymalizację rozmiaru bundle (code splitting, tree shaking)');
    }
    
    recommendations.push('• Regularnie uruchamiaj ten raport przed wdrożeniami');
    recommendations.push('• Skonfiguruj automatyczne testy w CI/CD');
    recommendations.push('• Monitoruj wydajność aplikacji w produkcji');
    
    return recommendations;
  }

  // Formatowanie drzewa projektu
  formatProjectTree(tree, prefix = '', depth = 0) {
    if (depth > 3) return '    ...(więcej plików)\n'; // Limit depth
    
    let result = '';
    const entries = Object.entries(tree);
    
    entries.forEach(([name, value], index) => {
      const isLast = index === entries.length - 1;
      const connector = isLast ? '└── ' : '├── ';
      const nextPrefix = prefix + (isLast ? '    ' : '│   ');
      
      result += prefix + connector + name + '\n';
      
      if (typeof value === 'object') {
        result += this.formatProjectTree(value, nextPrefix, depth + 1);
      }
    });
    
    return result;
  }

  // 3. Eksport całego kodu
  exportFullCode() {
    this.log('📤 Eksportowanie całego kodu źródłowego...', 'info');
    
    const htmlContent = `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kod Źródłowy - Projekt Stefano</title>
    <style>
        body { 
            font-family: 'Courier New', monospace; 
            margin: 0; 
            padding: 20px; 
            background: #1a1a1a; 
            color: #e0e0e0; 
            line-height: 1.4;
        }
        .header { 
            background: #333; 
            padding: 20px; 
            margin-bottom: 20px; 
            border-radius: 8px; 
            border-left: 4px solid #007acc;
        }
        .file-block { 
            margin: 20px 0; 
            background: #2d2d2d; 
            border-radius: 8px; 
            overflow: hidden;
            border: 1px solid #404040;
        }
        .file-header { 
            background: #404040; 
            padding: 10px 15px; 
            font-weight: bold; 
            color: #007acc;
            border-bottom: 1px solid #555;
        }
        .file-meta {
            font-size: 0.85em;
            color: #888;
            margin-left: 10px;
        }
        .code-content { 
            padding: 0; 
            overflow-x: auto;
        }
        pre { 
            margin: 0; 
            padding: 15px; 
            white-space: pre-wrap; 
            font-size: 13px;
            line-height: 1.5;
        }
        .line-numbers {
            color: #666;
            user-select: none;
            padding-right: 10px;
            border-right: 1px solid #555;
            margin-right: 10px;
        }
        .typescript { color: #007acc; }
        .javascript { color: #f7df1e; }
        .css { color: #1572b6; }
        .html { color: #e34f26; }
        .json { color: #85ea2d; }
        .markdown { color: #083fa1; }
        
        .keyword { color: #569cd6; }
        .string { color: #ce9178; }
        .comment { color: #6a9955; font-style: italic; }
        .number { color: #b5cea8; }
        
        .stats {
            background: #2d4a2d;
            padding: 15px;
            margin: 20px 0;
            border-radius: 8px;
            border-left: 4px solid #4caf50;
        }
        
        .tree {
            background: #2d2d4a;
            padding: 15px;
            margin: 20px 0;
            border-radius: 8px;
            border-left: 4px solid #9c27b0;
            font-family: monospace;
            white-space: pre;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🏗️ Kod Źródłowy - Projekt Stefano</h1>
        <p><strong>Data eksportu:</strong> ${new Date().toLocaleString('pl-PL')}</p>
        <p><strong>Łączna liczba plików:</strong> ${this.results.files.length}</p>
        <p><strong>Rozmiar projektu:</strong> ${this.results.stats.totalSize}KB</p>
    </div>

    <div class="stats">
        <h2>📊 Statystyki Projektu</h2>
        <p><strong>Pliki kodu:</strong> ${this.results.stats.codeFiles}</p>
        <p><strong>Łączne linie kodu:</strong> ${this.results.stats.totalLines}</p>
        <p><strong>Zależności npm:</strong> ${this.results.dependencies.total}</p>
        <p><strong>Status:</strong> ${this.results.errors.length === 0 ? '✅ Gotowy do produkcji' : '⚠️ Wymaga poprawek'}</p>
    </div>

    <div class="tree">
        <h2>🌳 Struktura Projektu</h2>
${this.formatProjectTree(this.results.stats.projectStructure)}
    </div>

    ${this.results.files
      .sort((a, b) => a.path.localeCompare(b.path))
      .map(file => this.generateFileBlock(file))
      .join('\n')}

    <div class="header">
        <p><em>Automatycznie wygenerowane przez System Diagnostyczno-Raportujący Stefano</em></p>
    </div>
</body>
</html>`;

    fs.writeFileSync('KOD_ŹRÓDŁOWY.html', htmlContent, 'utf8');
    this.log('✅ Kod źródłowy wyeksportowany jako KOD_ŹRÓDŁOWY.html', 'success');
  }

  // Generowanie bloku pliku
  generateFileBlock(file) {
    try {
      const content = fs.readFileSync(file.path, 'utf8');
      const extension = path.extname(file.path).toLowerCase();
      const language = this.getLanguageClass(extension);
      const highlighted = this.highlightSyntax(content, extension);
      
      return `
    <div class="file-block">
        <div class="file-header ${language}">
            📄 ${file.path}
            <span class="file-meta">
                • Rozmiar: ${Math.round(file.size / 1024)}KB 
                • Linie: ${file.lines} 
                • Modyfikacja: ${new Date(file.modified).toLocaleString('pl-PL')}
            </span>
        </div>
        <div class="code-content">
            <pre>${highlighted}</pre>
        </div>
    </div>`;
    } catch (error) {
      return `
    <div class="file-block">
        <div class="file-header">
            ❌ ${file.path}
            <span class="file-meta">Błąd odczytu: ${error.message}</span>
        </div>
    </div>`;
    }
  }

  // Określanie klasy języka
  getLanguageClass(extension) {
    const map = {
      '.ts': 'typescript',
      '.tsx': 'typescript',
      '.js': 'javascript',
      '.jsx': 'javascript',
      '.css': 'css',
      '.html': 'html',
      '.json': 'json',
      '.md': 'markdown'
    };
    return map[extension] || 'text';
  }

  // Podstawowe podświetlenie składni
  highlightSyntax(content, extension) {
    let highlighted = content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    if (['.ts', '.tsx', '.js', '.jsx'].includes(extension)) {
      highlighted = highlighted
        .replace(/(const|let|var|function|class|interface|type|export|import|async|await|return|if|else|for|while|try|catch)\b/g, '<span class="keyword">$1</span>')
        .replace(/(["'])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="string">$1$2$1</span>')
        .replace(/(\/\/.*$|\/\*[\s\S]*?\*\/)/gm, '<span class="comment">$1</span>')
        .replace(/\b(\d+)\b/g, '<span class="number">$1</span>');
    }

    // Add line numbers
    const lines = highlighted.split('\n');
    const numberedLines = lines.map((line, index) => {
      const lineNum = (index + 1).toString().padStart(4, ' ');
      return `<span class="line-numbers">${lineNum}</span>${line}`;
    });

    return numberedLines.join('\n');
  }

  // 4. Główna funkcja wykonawcza
  async runFullSystem() {
    this.log('🚀 Uruchamianie zaawansowanego systemu diagnostyczno-raportującego...', 'info');
    
    try {
      // 1. Pełna diagnostyka
      await this.runFullDiagnostics();
      
      // 2. Generowanie raportu
      this.generateDetailedReport();
      
      // 3. Eksport kodu
      this.exportFullCode();
      
      // Podsumowanie
      const duration = Math.round((Date.now() - this.startTime) / 1000);
      this.log(`\n🎯 DIAGNOSTYKA ZAKOŃCZONA POMYŚLNIE`, 'success');
      this.log(`⏱️ Czas wykonania: ${duration}s`, 'info');
      this.log(`📋 Raport: RAPORT.txt`, 'info');
      this.log(`📤 Kod źródłowy: KOD_ŹRÓDŁOWY.html`, 'info');
      this.log(`📊 Błędy: ${this.results.errors.length}, Ostrzeżenia: ${this.results.warnings.length}`, 'info');
      
      if (this.results.errors.length === 0) {
        this.log(`✅ PROJEKT GOTOWY DO WDROŻENIA`, 'success');
      } else {
        this.log(`⚠️ WYMAGA POPRAWEK PRZED WDROŻENIEM`, 'warning');
      }
      
    } catch (error) {
      this.log(`❌ BŁĄD KRYTYCZNY: ${error.message}`, 'error');
      process.exit(1);
    }
  }
}

// Natychmiastowe wykonanie
const diagnostics = new StefanoDiagnostics();
diagnostics.runFullSystem().catch(console.error);