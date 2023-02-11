import * as YAML from 'yaml';
import * as fs from 'fs';


export {
    Config,
}

class Config {
    white_list: string[];
    master: string[];
    xcpc_report: string[];
    constructor() {
        try {
            let buffer = fs.readFileSync('config.yaml', 'utf8');
            let config = YAML.parse(buffer);
            this.white_list = config['white_list'];
            this.master = config['master'];
            this.xcpc_report = config['xcpc_report'];
        } catch (err) {
            console.log(err)
        }
    }
}