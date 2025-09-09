using System.Text.RegularExpressions;
using System.Web;

namespace api.Helpers
{
    public static class InputSanitizer
    {
        private static readonly string[] DangerousPatterns = new[]
        {
            // Script tags and variations
            @"<script[^>]*>.*?</script>",
            @"<script[^>]*/>",
            @"<script[^>]*>",
            @"</script>",
            
            // JavaScript protocols
            @"javascript:",
            @"vbscript:",
            @"data:text/html",
            @"data:application/javascript",
            
            // Event handlers (comprehensive list)
            @"onload=", @"onerror=", @"onclick=", @"onmouseover=",
            @"onfocus=", @"onblur=", @"onchange=", @"onsubmit=",
            @"onkeydown=", @"onkeyup=", @"onkeypress=",
            @"onmousedown=", @"onmouseup=", @"onmousemove=",
            @"onmouseout=", @"onmouseenter=", @"onmouseleave=",
            @"oncontextmenu=", @"ondblclick=", @"ondrag=",
            @"ondragend=", @"ondragenter=", @"ondragleave=",
            @"ondragover=", @"ondragstart=", @"ondrop=",
            @"onscroll=", @"onresize=", @"onselect=",
            @"onselectstart=", @"onabort=", @"oncanplay=",
            
            // Dangerous HTML elements
            @"<iframe[^>]*>.*?</iframe>",
            @"<iframe[^>]*/>",
            @"<iframe[^>]*>",
            @"<object[^>]*>.*?</object>",
            @"<object[^>]*/>",
            @"<embed[^>]*>.*?</embed>",
            @"<embed[^>]*/>",
            @"<applet[^>]*>.*?</applet>",
            @"<form[^>]*>.*?</form>",
            @"<form[^>]*>",
            @"<input[^>]*>",
            @"<textarea[^>]*>",
            @"<select[^>]*>",
            @"<meta[^>]*>",
            @"<link[^>]*>",
            @"<base[^>]*>",
            
            // CSS expressions and imports
            @"expression\s*\(",
            @"-moz-binding:",
            @"@import",
            @"url\s*\(\s*[""']?javascript:",
            @"url\s*\(\s*[""']?data:",
            
            // HTML comments that might contain script
            @"<!--.*?-->",
            
            // SVG script injection
            @"<svg[^>]*>.*?<script.*?</script>.*?</svg>",
            
            // Encoded variations
            @"&#x?[0-9a-f]+;", // HTML entities (basic detection)
            @"%[0-9a-f]{2}", // URL encoding (basic detection)
            
            // Dangerous attributes
            @"src\s*=\s*[""']?javascript:",
            @"href\s*=\s*[""']?javascript:",
            @"action\s*=\s*[""']?javascript:",
            @"formaction\s*=\s*[""']?javascript:",
            @"background\s*=\s*[""']?javascript:",
            @"style\s*=.*?javascript:",
            @"style\s*=.*?expression\s*\("
        };

        /// <summary>
        /// Validates if content contains dangerous XSS patterns
        /// </summary>
        /// <param name="content">Content to validate</param>
        /// <returns>True if content is safe, false if contains dangerous patterns</returns>
        public static bool IsContentSafe(string content)
        {
            if (string.IsNullOrEmpty(content))
                return true;

            // Normalize the content first
            string normalizedContent = NormalizeContent(content);

            foreach (var pattern in DangerousPatterns)
            {
                if (Regex.IsMatch(normalizedContent, pattern, RegexOptions.IgnoreCase | RegexOptions.Singleline))
                {
                    return false;
                }
            }

            return true;
        }

        /// <summary>
        /// Normalizes content to detect encoded XSS attempts
        /// </summary>
        private static string NormalizeContent(string content)
        {
            if (string.IsNullOrEmpty(content))
                return content;

            // Decode HTML entities
            content = HttpUtility.HtmlDecode(content);
            
            // Decode URL encoding
            content = HttpUtility.UrlDecode(content);
            
            // Remove null bytes and normalize whitespace
            content = content.Replace("\0", "").Replace("\u0000", "");
            content = Regex.Replace(content, @"\s+", " ");
            
            return content;
        }

        /// <summary>
        /// Sanitizes HTML content by encoding dangerous characters
        /// </summary>
        public static string SanitizeHtmlContent(string content)
        {
            if (string.IsNullOrEmpty(content))
                return content;

            // HTML encode the entire content first
            string sanitized = HttpUtility.HtmlEncode(content);
            
            // Allow basic HTML tags for content formatting
            var allowedTags = new Dictionary<string, string>
            {
                { "&lt;p&gt;", "<p>" },
                { "&lt;/p&gt;", "</p>" },
                { "&lt;br&gt;", "<br>" },
                { "&lt;br/&gt;", "<br/>" },
                { "&lt;strong&gt;", "<strong>" },
                { "&lt;/strong&gt;", "</strong>" },
                { "&lt;b&gt;", "<b>" },
                { "&lt;/b&gt;", "</b>" },
                { "&lt;em&gt;", "<em>" },
                { "&lt;/em&gt;", "</em>" },
                { "&lt;i&gt;", "<i>" },
                { "&lt;/i&gt;", "</i>" },
                { "&lt;u&gt;", "<u>" },
                { "&lt;/u&gt;", "</u>" },
                { "&lt;ul&gt;", "<ul>" },
                { "&lt;/ul&gt;", "</ul>" },
                { "&lt;ol&gt;", "<ol>" },
                { "&lt;/ol&gt;", "</ol>" },
                { "&lt;li&gt;", "<li>" },
                { "&lt;/li&gt;", "</li>" }
            };

            foreach (var tag in allowedTags)
            {
                sanitized = sanitized.Replace(tag.Key, tag.Value);
            }

            return sanitized;
        }

        /// <summary>
        /// Gets validation error message for unsafe content
        /// </summary>
        /// <param name="fieldName">Name of the field being validated</param>
        /// <returns>Error message</returns>
        public static string GetValidationErrorMessage(string fieldName)
        {
            return $"Nội dung {fieldName} chứa các thành phần không an toàn và không được phép.";
        }

        /// <summary>
        /// Validates multiple content fields
        /// </summary>
        /// <param name="contents">Dictionary of field names and their content</param>
        /// <returns>List of validation error messages</returns>
        public static List<string> ValidateContents(Dictionary<string, string> contents)
        {
            var errors = new List<string>();
            
            foreach (var kvp in contents)
            {
                if (!IsContentSafe(kvp.Value))
                {
                    errors.Add(GetValidationErrorMessage(kvp.Key));
                }
            }
            
            return errors;
        }
    }
}