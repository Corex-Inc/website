export type MetaFilter = 'command' | 'tag' | 'object' | 'formatter' | 'mechanism' | 'event';

export interface MetaCommand extends MetaDefault {
  type: 'command';
  syntax: string;
  requiredargs: string;
  maxargs: string;
  shortdescription: string;
  implements: string;
  usage: string | string[];
  waitable?: string;
}

export interface MetaTag extends MetaDefault {
  type: 'tag';
  rawname: string;
  object: string;
  returntype: string;
}

export interface MetaObject extends MetaDefault {
  type: 'object';
  prefix: string;
  format: string | string[];
}

export interface MetaFormatter extends MetaDefault {
  type: 'formatter';
  usage: string | string[];
}

export interface MetaMechanism extends MetaDefault {
  type: 'mechanism';
  object?: string;
  input?: string;
}

export interface MetaEvent extends MetaDefault {
  type: 'event';
  events: string | string[];
  cancellable: string;
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
    description: string | string[];
    name: string;
}

export type MetaItem = MetaCommand | MetaTag | MetaObject | MetaFormatter | MetaMechanism | MetaEvent;
