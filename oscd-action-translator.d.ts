import { LitElement } from 'lit';
import { Edit, EditEvent, Insert, Remove, Update } from '@openscd/open-scd-core';
import { ComplexAction, Create, Delete, EditorAction, OldUpdate } from './foundation/action-event.js';
export declare function createUpdateAction(element: Element, newAttributes: Record<string, string | null>): OldUpdate;
/** Transforming attributes form Update to newAttributes of OldUpdate */
export declare function addMissingAttributes(element: Element, newAttributes: Record<string, string | null>): Record<string, string | null>;
export default class OscdSave extends LitElement {
    constructor();
    handleComplex(edits: Edit[]): ComplexAction;
    handleUpdate({ element, attributes }: Update): OldUpdate;
    handleRemove({ node }: Remove): Delete | null;
    handleInsert({ parent, node, reference }: Insert): Create;
    handleEdit(edit: Edit): EditorAction | null;
    protected handleEditEvent(event: EditEvent): void;
    run(): Promise<void>;
}
