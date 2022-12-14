import { LitElement } from 'lit';
import { Edit, EditEvent, Insert, Remove, Update } from '@openscd/open-scd-core';
import { Create, Delete, OldUpdate } from './foundation/action-event.js';
export declare function createUpdateAction(element: Element, newAttributes: Record<string, string | null>): OldUpdate;
/** Transforming attributes form Update to newAttributes of OldUpdate */
export declare function addMissingAttributes(element: Element, newAttributes: Record<string, string | null>): Record<string, string | null>;
export default class OscdSave extends LitElement {
    constructor();
    handleComplex(edits: Edit[]): void;
    updateToOldUpdate({ element, attributes }: Update): OldUpdate;
    handleUpdate({ element, attributes }: Update): void;
    removeToDelete({ node }: Remove): Delete | null;
    handleRemove({ node }: Remove): void;
    insertToCreate({ parent, node, reference }: Insert): Create;
    handleInsert({ parent, node, reference }: Insert): void;
    handleEdit(edit: Edit): void;
    protected handleEditEvent(event: EditEvent): void;
    run(): Promise<void>;
}
