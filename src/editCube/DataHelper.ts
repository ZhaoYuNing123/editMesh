// import * as fs from 'fs'
// import * as path from "path";
// import * as os from 'os';

// // declare var __ConfigData: { [filename: string]: string };
// // declare module sss {

// // }

// // export function readData(fileName: string): { [name: string]: string } {
// //     const cacheFileName = path.join(os.homedir(), '.egretpro', fileName);
// //     if (fs.existsSync(cacheFileName)) {
// //         const content = fs.readFileSync(cacheFileName, 'utf-8');
// //         try {
// //             return JSON.parse(content);
// //         } catch (error) {
// //             throw new Error(`${cacheFileName} 文件格式错误`);
// //         }
// //     } 
// //     return {};
// // }

// export function writeData(data: any, fileName: string) {
//     const cacheDirector = path.join(os.homedir(), '.egretpro');
//     if (!fs.existsSync(cacheDirector)) {
//         fs.mkdirSync(cacheDirector);
//     }
//     const cacheFileName = path.join(os.homedir(), '.egretpro', fileName);
//     const text = JSON.stringify(data, null, 4);
//     fs.writeFileSync(cacheFileName, text, 'utf-8');
// }


// const pathTest = path.resolve('./resource/modelData/a.txt');


// export function writeAniFiles(dirName) {
//     dirName = path.resolve(__dirname, dirName);
//     if (!fs.existsSync(dirName)) {
//         fs.mkdirSync(dirName);
//     }
//     const content = "aaaa"
//     fs.writeFileSync(pathTest, JSON.stringify(content, null, 4), 'utf-8');

// }

// // export function getData(name: string, fileName: string) {
// //     const data = readData(fileName);
// //     if (!data[name]) {
// //         return null;
// //     }
// //     return data[name];
// // }

// // export function setData(name: string, root: string, fileName: string) {
// //     if (path.isAbsolute(root)) {
// //         const data = readData(fileName);
// //         data[name] = root;
// //         writeData(data, fileName);
// //     }
// //     else {
// //         throw new Error('root 必须是绝对路径');
// //     }
// // }

// // export function removeData(name: string, fileName: string) {
// //     const data = readData(fileName);
// //     if (data[name]) {
// //         delete data[name];
// //         writeData(data, fileName);
// //     }
// //     return true;
// // }

// // export function getList(fileName: string) {
// //     const result = [];
// //     const json = readData(fileName);
// //     for (const key in json) {
// //         result.push({ name: key, path: json[key] });
// //     }
// //     return result;
// // }

// // export function getEngineRoot(name: string) {
// //     return getData(name, 'engines.json');
// // }

// // export function setEngineRoot(name: string, root: string) {
// //     setData(name, root, 'engines.json');

// // }

// // export function removeEngineRoot(name: string) {
// //     return removeData(name, 'engines.json');
// // }

// // export function getEngineList() {
// //     return getList('engines.json');
// // }

// // export function getTool(name: string): string {
// //     const root = getData(name, 'tools.json');
// //     if (!root) {
// //         throw new Error(`${name} tool is not exist.`);
// //     }
// //     return root;
// // }

// // export function setTool(name: string, root: string) {
// //     setData(name, root, 'tools.json');
// // }

// // export function removeTool(name: string) {
// //     return removeData(name, 'tools.json');
// // }

// // export function getToolList() {
// //     return getList('tools.json');
// // }