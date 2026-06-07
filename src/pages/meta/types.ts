export type MetaFilter = 'command' | 'tag' | 'object' | 'formatter' | 'mechanism' | 'event';

export interface MetaCommand extends MetaDefault {
  type: 'command';
  name: string;
  syntax: string;
  requiredargs: string;
  maxargs: string;
  shortdescription: string;
  implements: string;
  description: string | string[];
  usage: string | string[];
  waitable?: string;
}

export interface MetaTag extends MetaDefault {
  type: 'tag';
  name: string;
  rawname: string;
  object: string;
  returntype: string;
  description: string | string[];
}

export interface MetaObject extends MetaDefault {
  type: 'object';
  name: string;
  prefix: string;
  format: string | string[];
  description: string | string[];
}

export interface MetaFormatter extends MetaDefault {
  type: 'formatter';
  name: string;
  description: string | string[];
  usage: string | string[];
}

export interface MetaMechanism extends MetaDefault {
  type: 'mechanism';
  name: string;
  description: string | string[];
  object?: string;
  input?: string;
}

export interface MetaEvent extends MetaDefault {
  type: 'event';
  name: string;
  events: string | string[];
  cancellable: string;
  description: string | string[];
  context: string | string[];
  usage: string | string[];
  returns: string | string[];
}

export interface MetaDefault {
    url: string;
    line: number;
    file: string;
    implements?: string;
    warning?: string | string[];
}

export type MetaItem = MetaCommand | MetaTag | MetaObject | MetaFormatter | MetaMechanism | MetaEvent;
