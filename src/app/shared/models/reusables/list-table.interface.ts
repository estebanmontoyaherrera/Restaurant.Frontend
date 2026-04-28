export interface TableColumns<T> {
  label: string;
  subLabel?: string;
  cssLabel: string[];
  cssSubLabel?: string[];
  property: keyof T | string;
  cssProperty: string[];
  subProperty?: keyof T | string;
  cssSubProperty?: string[];
  type:
    | 'number'
    | 'text'
    | 'date'
    | 'datetime'
    | 'time'
    | 'simpleBadge'
    | 'DateBadge'
    | 'multipleBadge'
    | 'icon'
    | 'button'
    | 'textWithPic'
    | 'DateSingleBadge'
    | 'badgeButton';
  visible: boolean;
  visibleIndividualList?: boolean;
  sort: boolean;
  sortProperty?: string;
  action?: string;
  icon?: string;
  cssIcon?: string;
  sticky: boolean;
  stickyEnd?: boolean;
  tooltip?: string;
  download?: boolean;
  property_download?: string;
}

export interface TableFooter<T> {
  label: string;
  property: keyof T | string;
  tooltip: string;
}
