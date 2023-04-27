import config from './config'

export const getReport = async (date, type) => {

    fetch(config.apiEndpoint + `/getReport/${type}/${date}`)

        // (B) RETURN AS BLOB
        .then((result) => {
            if (result.status !== 200) { throw new Error("Bad server response"); }
            return result.blob();
        })

        // (C) BLOB DATA
        .then((data) => {
            // (C1) FILE DATA IS "READY FOR USE"
            console.log(data);

            // (C2) TO "FORCE DOWNLOAD"
            let url = window.URL.createObjectURL(data),
                anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = date;
            anchor.click();

            // (C3) CLEAN UP
            window.URL.revokeObjectURL(url);
            document.removeChild(anchor);
        })
        .catch((error) => { console.log(error); });
}