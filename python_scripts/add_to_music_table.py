from bs4 import BeautifulSoup

def add_row_to_html_table(file_path):
    # Read the HTML content from a file
    with open(file_path, 'r', encoding='utf-8') as file:
        html_content = file.read()

    # Parse the HTML content
    soup = BeautifulSoup(html_content, 'html.parser')

    # Find the table in the HTML
    table = soup.find('table')

    # Prompt the user for new row data
    print("Please enter the data for the new row:")
    a_href = input("Link Href: ")
    album_code = input("Album Code (e.g., album=177065522): ")
    iframe_text = input("Iframe Text: ")
    title = input("Title: ")
    artist = input("Artist: ")
    date = input("Date: ")
    description = input("Description: ")

    # Construct iframe src using album code
    iframe_src = f"https://bandcamp.com/EmbeddedPlayer/{album_code}/size=large/bgcol=ffffff/linkcol=0687f5/minimal=true/transparent=true/"

    # Construct a new row
    new_row = soup.new_tag('tr')
    
    # Image cell with link and iframe
    td_image = soup.new_tag('td', attrs={'class': 'image'})
    a_tag = soup.new_tag('a', href=a_href)
    iframe_tag = soup.new_tag('iframe', src=iframe_src, style="border: 0; width: 300px; height: 300px;", seamless="")
    iframe_tag.append(soup.new_tag('a', href=a_href))
    iframe_tag.a.string = iframe_text
    a_tag.append(iframe_tag)
    td_image.append(a_tag)
    new_row.append(td_image)

    # Other cells
    for cell_text in [title, artist, date]:
        td = soup.new_tag('td')
        td.string = cell_text
        new_row.append(td)

    # Description cell with div
    td_description = soup.new_tag('td')
    div_desc = soup.new_tag('div', attrs={'class': 'album-desc'})
    div_desc.append(BeautifulSoup(description, 'html.parser'))  # Parse HTML in description
    td_description.append(div_desc)
    new_row.append(td_description)

    # Insert the new row as the second row in the table
    header_row = table.find('tr')
    header_row.insert_after(new_row)

    # Write the modified HTML to a file
    with open('output.html', 'w', encoding='utf-8') as file:
        file.write(str(soup))

# Example usage
add_row_to_html_table('music.html')
