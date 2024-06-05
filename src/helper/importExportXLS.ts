import * as XLSX from 'xlsx';

function trim_headers(ws: XLSX.WorkSheet) {
	if(!ws || !ws["!ref"]) return;
	var ref = XLSX.utils.decode_range(ws["!ref"]);
	for(var C = ref.s.c; C <= ref.e.c; ++C) {
		var cell = ws[XLSX.utils.encode_cell({r:ref.s.r, c:C})];
		if(cell.t == "s") {
			cell.v = cell.v.trim();
			if(cell.w) cell.w = cell.w.trim();
		}
	}
}

export const exportToExcel = (data: any, name: string) => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Planilha1");
    setTimeout(() => {
      XLSX.writeFile(workbook, `${name.toUpperCase()}.xlsx`)
    }, 100);
  };

  export const importFromExcel = (data: any, type: "string" | "buffer" | "base64" | "binary" | "file" | "array" | undefined = 'buffer') => {
    const workbook = XLSX.read(data, {type})
    const worksheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[worksheetName];
    trim_headers(worksheet)
    return XLSX.utils.sheet_to_json(worksheet)
  };
