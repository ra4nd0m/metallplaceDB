import os
import shutil
from io import BytesIO
import zipfile
from bs4 import BeautifulSoup


pattern = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?> <w:ftr xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" mc:Ignorable="w14 wp14 w15"> <w:tbl> <w:tblPr> <w:tblW w:w="5000" w:type="pct"/> <w:jc w:val="left"/> <w:tblInd w:w="0" w:type="dxa"/> <w:tblLayout w:type="fixed"/> <w:tblCellMar> <w:top w:w="0" w:type="dxa"/> <w:left w:w="1020" w:type="dxa"/> <w:bottom w:w="0" w:type="dxa"/> <w:right w:w="1020" w:type="dxa"/> </w:tblCellMar> </w:tblPr> <w:tblGrid> <w:gridCol w:w="9602"/> <w:gridCol w:w="2303"/> </w:tblGrid> <w:tr> <w:trPr></w:trPr> <w:tc> <w:tcPr> <w:tcW w:w="9602" w:type="dxa"/> <w:tcBorders></w:tcBorders> </w:tcPr> <w:p> <w:pPr> <w:pStyle w:val="Normal"/> <w:widowControl w:val="false"/> <w:spacing w:before="40" w:after="0"/> <w:jc w:val="both"/> <w:rPr></w:rPr> </w:pPr> <w:r> <w:rPr> <w:rFonts w:eastAsia="Montserrat" w:cs="Montserrat" w:ascii="Montserrat" w:hAnsi="Montserrat"/> <w:color w:val="747474"/> <w:sz w:val="24"/> <w:szCs w:val="24"/> </w:rPr> <w:t xml:space="preserve">Отчетный период: </w:t> </w:r> <w:r> <w:rPr> <w:rFonts w:eastAsia="Montserrat ExtraBold" w:cs="Montserrat ExtraBold" w:ascii="Montserrat ExtraBold" w:hAnsi="Montserrat ExtraBold"/> <w:color w:val="747474"/> <w:sz w:val="24"/> <w:szCs w:val="24"/> </w:rPr> <w:t xml:space="preserve">{{dates}}</w:t> </w:r> <w:r> <w:rPr> <w:rFonts w:eastAsia="Montserrat" w:cs="Montserrat" w:ascii="Montserrat" w:hAnsi="Montserrat"/> <w:color w:val="747474"/> <w:sz w:val="24"/> <w:szCs w:val="24"/> </w:rPr> <w:t>{{year}}</w:t> </w:r> </w:p> </w:tc> <w:tc> <w:tcPr> <w:tcW w:w="2303" w:type="dxa"/> <w:tcBorders></w:tcBorders> </w:tcPr> <w:p> <w:pPr> <w:pStyle w:val="Normal"/> <w:widowControl w:val="false"/> <w:spacing w:before="40" w:after="0"/> <w:jc w:val="right"/> <w:rPr> <w:rFonts w:ascii="Montserrat" w:hAnsi="Montserrat"/> </w:rPr> </w:pPr> <w:r> <w:rPr> <w:rFonts w:ascii="Montserrat" w:hAnsi="Montserrat"/> </w:rPr> <w:fldChar w:fldCharType="begin"></w:fldChar> </w:r> <w:r> <w:rPr> <w:rFonts w:ascii="Montserrat" w:hAnsi="Montserrat"/> </w:rPr> <w:instrText xml:space="preserve"> PAGE </w:instrText> </w:r> <w:r> <w:rPr> <w:rFonts w:ascii="Montserrat" w:hAnsi="Montserrat"/> </w:rPr> <w:fldChar w:fldCharType="separate"/> </w:r> <w:r> <w:rPr> <w:rFonts w:ascii="Montserrat" w:hAnsi="Montserrat"/> </w:rPr> <w:t>22</w:t> </w:r> <w:r> <w:rPr> <w:rFonts w:ascii="Montserrat" w:hAnsi="Montserrat"/> </w:rPr> <w:fldChar w:fldCharType="end"/> </w:r> </w:p> </w:tc> </w:tr> </w:tbl> </w:ftr>'


def read_xml(path):
    """Reads the contents of an XML file and returns it as a string.

    Args:
        path: The path to the XML file.

    Returns:
        The contents of the XML file as a string.
    """

    with open(path, "r") as f:
        xml_string = f.read()

    return xml_string

def get_date_year(xml_string):

    soup = BeautifulSoup(xml_string, 'html.parser')

    # Extracting the dates
    dates_tag = soup.find_all('w:t', {'xml:space': 'preserve'})[1]
    dates = dates_tag.text.strip()

    # Extracting the year
    year_tag = soup.find_all('w:t',)[2]
    year_tag11111 = soup.find_all('w:t')
    year = year_tag.text.strip()

    return dates, year
    

def format_xml(xml_string):
    dates, year = get_date_year(xml_string)
    return pattern.replace("{{dates}}", dates + " ").replace("{{year}}", year)


    
def rewrite_xml(path, xml_string):
    """Rewrites the contents of an XML file with the given string.

    Args:
        path: The path to the XML file.
        xml_string: The string to rewrite the contents of the XML file with.
    """

    with open(path, "w") as f:
        f.write(xml_string)
    

def zip_folder(folder_path, zip_path):
    # Zip the folder
    shutil.make_archive(zip_path, 'zip', folder_path)
    shutil.rmtree(folder_path)

def change_extension(file_path, new_extension):
    # Change the file extension
    base_path = os.path.splitext(file_path)[0]
    new_file_path = base_path + '.' + new_extension
    os.rename(file_path, new_file_path)







def change_footer(file_name):
    modified_zip_name = "modified"
    # Change the file extension to zip
    change_extension(file_name + ".docx", 'zip')

    # Unzip the file
    unzip_folder_path = os.path.splitext(file_name)[0]
    with zipfile.ZipFile(file_name + ".zip", 'r') as zip_ref:
        zip_ref.extractall(unzip_folder_path)

    # Change the font in footer1.xml
    xml_string = read_xml(unzip_folder_path + "/word/footer1.xml")
    new_xml_string = format_xml(xml_string)
    rewrite_xml(unzip_folder_path + "/word/footer1.xml", new_xml_string)

    # Zip the folder again
    zip_folder(unzip_folder_path, modified_zip_name)

    # Change the file extension back to docx
    change_extension(modified_zip_name + ".zip", 'docx')
    modified_bytes = file_to_bytes(modified_zip_name + ".docx")
    os.remove(modified_zip_name + ".docx")
    os.remove(file_name + ".zip")
    return modified_bytes



def file_to_bytes(file_path):
    with open(file_path, 'rb') as file:
        file_bytes = file.read()
    return file_bytes

def bytes_to_file(file_bytes, file_path):
    with open(file_path, 'wb') as file:
        file.write(file_bytes)


def modify_docx(bytes):
    print("Recieved docx")
    original_file_name = 'original'
    bytes_to_file(bytes, original_file_name + ".docx")
    modified_bytes = change_footer(original_file_name)
    return modified_bytes

