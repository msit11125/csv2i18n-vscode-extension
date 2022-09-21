import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let fs = require("fs");
  let path = require("path");

  let disposable = vscode.commands.registerCommand(
    "csv2i18n.converter",
    async () => {
      const currentlyOpenTabFilePath =
        vscode.window.activeTextEditor?.document.uri.fsPath;
      if (!currentlyOpenTabFilePath) {
        vscode.window.showInformationMessage("CSV Format wrong.");
        return;
      }
      if (path.extname(currentlyOpenTabFilePath) !== ".csv") {
        vscode.window.showInformationMessage("CSV Format wrong.");
        return;
      }

      const currentlyOpenTabFolder = path.dirname(currentlyOpenTabFilePath);
      const text = vscode.window.activeTextEditor?.document.getText();

      const searchQuery = await vscode.window.showInputBox({
        placeHolder: "Seperate by which symbol, default: 「｜」",
        value: "",
      });

      let seperated = searchQuery || "|";
      let data = <string[]>text?.split("\n");
      let schemas: {
        language: string;
        array: { field: string; value: string }[];
      }[] = [];

      for (const [i, row] of data.entries()) {
        const columns = row.split(seperated);
        if (i === 0) {
          // header
          schemas = columns.slice(1).map((c) => ({ language: c, array: [] }));
          continue;
        }
        let key = "";
        for (const [j, col] of columns.entries()) {
          if (j === 0) {
            // key
            key = col;
            continue;
          }
          // is Empty
          if (!col || col.length === 0) {
            continue;
          }
          schemas[j - 1].array.push({ field: key, value: col });
        }
      }

      // order by words

      // #1 Mapping the array to an object...
      for (const schema of schemas) {
        const sorted = schema.array.sort((a, b) => a.field.localeCompare(b.field));
        let obj = sorted.reduce(
          (acc, { field, value }) => ({ ...acc, [field]: value }),
          {}
        );
        let data: { [key: string]: any } = {};
        data[schema.language] = obj;
        let json = JSON.stringify(data, null, 4);
        // #2 Converting the object to JSON...
        fs.writeFile(
          `${currentlyOpenTabFolder}/${schema.language}.json`,
          json,
          function (err: any) {
            if (err) throw err;
            vscode.window.showInformationMessage(
              `Convert ${schema.language}.json done.`
            );
          }
        );
      }
    }
  );
  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
