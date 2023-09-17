import pdfplumber
from collections import defaultdict

def extract_text_with_extra_spacing(pdf_path, output_txt_path, x_tolerance=1, y_tolerance=1, space_scaling_factor=6, paragraph_threshold=20):
    with pdfplumber.open(pdf_path) as pdf:
        with open(output_txt_path, 'w', encoding='utf-8') as txt_file:
            for page in pdf.pages:
                # Add a separator for a new page
                txt_file.write("\n*---*\n")
                
                # Extract words and their positions
                words = page.extract_words(x_tolerance=x_tolerance, y_tolerance=y_tolerance)
                
                if not words:
                    continue
                
                # Extract text normally to get single spaces between words
                normal_text = page.extract_text(x_tolerance=x_tolerance)
                normal_words = normal_text.split()
                
                # Group words by their y-position to identify lines
                lines = defaultdict(list)
                for word in words:
                    lines[word['top']].append(word)
                
                # Sort lines by their y-position
                sorted_lines = sorted(lines.items())
                
                # Initialize variables
                normal_word_index = 0
                prev_y_position = sorted_lines[0][0]
                
                for y_position, line_words in sorted_lines:
                    # Detect paragraph breaks based on vertical gaps between lines
                    if y_position - prev_y_position > paragraph_threshold:
                        txt_file.write('<br class="special">\n\n')
                    
                    line_words = sorted(line_words, key=lambda x: x['x0'])  # Sort words in line by x-position
                    line = ""
                    prev_x1 = line_words[0]['x1']
                    
                    for word_info in line_words[1:]:
                        x0, x1 = word_info['x0'], word_info['x1']
                        
                        # Calculate the number of extra spaces needed based on x-positions
                        num_extra_spaces = round((x0 - prev_x1) / space_scaling_factor)
                        if num_extra_spaces: num_extra_spaces += 1
                        
                        # Add the next word from the normally extracted text, with extra spaces if needed
                        line += normal_words[normal_word_index] + '&nbsp;' * num_extra_spaces + ' '
                        
                        normal_word_index += 1
                        prev_x1 = x1
                    
                    # Add the last word in the line
                    line += normal_words[normal_word_index]
                    normal_word_index += 1
                    
                    # Write the line to the text file, followed by a newline character and <br>
                    txt_file.write(line + "<br>\n")
                    
                    prev_y_position = y_position

# Usage
extract_text_with_extra_spacing(
    'fucking-up-certainly-go.pdf', 
    'extracted_text_with_extra_spacing.html', 
    x_tolerance=1, 
    y_tolerance=1, 
    space_scaling_factor=6, 
    paragraph_threshold=20
)

