export interface Card {
    id: number;
    name: string;
    description: string;
    display: string;
}

export interface VisualizationCardSettings {}

export interface ParameterMapping {
    card_id: number;
    parameter_id: string;
    target: (string | string[])[];
}

export interface OrderedCard {
    id: number;
    card_id: number;
    col: number;
    row: number;
    size_x: number;
    size_y: number;
    dashboard_id: number;
    created_at: string;
    updated_at: string;
    visualization_settings: VisualizationCardSettings;
    card: Card;
    parameter_mappings: ParameterMapping[];
}

export interface ParamField {
    id: number;
    has_field_values: string;
    display_name: string;
}

export interface ParamsFields {
    [id: number]: ParamField;
}

export interface Parameter {
    id: string;
    name: string;
    type: string;
}

export interface Dashboard {
    id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
    dashcards: OrderedCard[];
    param_fields: ParamsFields;
    parameters: Parameter[];
}
