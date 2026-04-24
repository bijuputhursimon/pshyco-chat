/**
 * Test Framework & Runner
 * Simple HTML-based testing without external dependencies
 */

window.TestFramework = window.TestFramework || {};

// Test results storage
window.TestFramework.results = {
    suites: [],
    totalTests: 0,
    passedTests: 0,
    failedTests: 0
};

/**
 * Simple assertion helper
 */
window.TestFramework.assert = function(condition, message) {
    if (!condition) {
        throw new Error(message || 'Assertion failed');
    }
};

/**
 * Assert that a function throws an error
 */
window.TestFramework.assertThrows = function(fn, expectedMessage) {
    let threw = false;
    
    try {
        fn();
    } catch (e) {
        threw = true;
        if (expectedMessage && !e.message.includes(expectedMessage)) {
            throw new Error(`Expected error containing "${expectedMessage}", got "${e.message}"`);
        }
    }
    
    if (!threw) {
        throw new Error('Expected function to throw an error');
    }
};

/**
 * Create a test suite with multiple tests
 */
window.TestFramework.describe = function(suiteName, testFn) {
    const suite = {
        name: suiteName,
        tests: [],
        passed: 0,
        failed: 0
    };
    
    // Provide it() function to test callbacks
    const context = {
        it: function(testName, testFn) {
            const test = {
                name: testName,
                passed: false,
                error: null
            };
            
            try {
                testFn();
                test.passed = true;
                suite.passed++;
                window.TestFramework.results.passedTests++;
            } catch (e) {
                test.passed = false;
                test.error = e.message;
                suite.failed++;
                window.TestFramework.results.failedTests++;
            }
            
            suite.tests.push(test);
            window.TestFramework.results.totalTests++;
        }
    };
    
    testFn(context.it);
    window.TestFramework.results.suites.push(suite);
};

/**
 * Display test results on page
 */
window.TestFramework.displayResults = function() {
    const resultsDiv = document.getElementById('results');
    if (!resultsDiv) return;
    
    resultsDiv.innerHTML = '';
    
    window.TestFramework.results.suites.forEach(suite => {
        const suiteDiv = document.createElement('div');
        suiteDiv.className = 'test-suite';
        
        let html = `<h3>${suite.name}</h3>`;
        
        suite.tests.forEach(test => {
            const statusClass = test.passed ? 'test-pass' : 'test-fail';
            const statusSymbol = test.passed ? '✓' : '✗';
            html += `<div class="test-name"><span class="${statusClass}">${statusSymbol} ${test.name}</span>`;
            
            if (test.error) {
                html += `<div class="error-message">${test.error}</div>`;
            }
            
            html += `</div>`;
        });
        
        suiteDiv.innerHTML = html;
        resultsDiv.appendChild(suiteDiv);
    });
    
    // Summary
    const summaryDiv = document.createElement('div');
    const allPass = window.TestFramework.results.failedTests === 0;
    summaryDiv.className = `summary ${allPass ? 'all-pass' : 'has-fail'}`;
    summaryDiv.innerHTML = `
        <strong>Summary:</strong> Total: ${window.TestFramework.results.totalTests} | 
        Passed: <span class="test-pass">${window.TestFramework.results.passedTests}</span> | 
        Failed: <span class="test-fail">${window.TestFramework.results.failedTests}</span>
    `;
    resultsDiv.appendChild(summaryDiv);
};

/**
 * Clear results
 */
window.TestFramework.clearResults = function() {
    const resultsDiv = document.getElementById('results');
    if (resultsDiv) resultsDiv.innerHTML = '';
    window.TestFramework.results = {
        suites: [],
        totalTests: 0,
        passedTests: 0,
        failedTests: 0
    };
};

/**
 * Run all tests (display on load)
 */
window.TestFramework.runAllTests = function() {
    window.TestFramework.displayResults();
};
