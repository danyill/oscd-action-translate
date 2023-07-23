/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-alert */
import { LitElement } from 'lit';

import {
  AttributeValue,
  Edit,
  EditEvent,
  Insert,
  isComplex,
  isInsert,
  isNamespaced,
  isRemove,
  isUpdate,
  Remove,
  Update,
} from '@openscd/open-scd-core';

import {
  ComplexAction,
  Create,
  Delete,
  EditorAction,
  newActionEvent,
  OldUpdate,
  SimpleAction,
} from './foundation/action-event.js';

function filterNamespacedAttributes(
  attributes: Partial<Record<string, AttributeValue>>
): Record<string, string | null> {
  const newAttributes: Record<string, string | null> = {};
  Object.entries(attributes).forEach(([key, value]) => {
    if (value !== undefined && !isNamespaced(value)) newAttributes[key] = value;
  });

  return newAttributes;
}

//* Add oldAttributes parameter to OldUpdate action */
export function createUpdateAction(
  element: Element,
  newAttributes: Record<string, string | null>
): OldUpdate {
  const oldAttributes: Record<string, string | null> = {};
  Array.from(element.attributes).forEach(attr => {
    oldAttributes[attr.name] = attr.value;
  });

  return { element, oldAttributes, newAttributes };
}

/** Transforming attributes form Update to newAttributes of OldUpdate */
export function addMissingAttributes(
  element: Element,
  newAttributes: Record<string, string | null>
): Record<string, string | null> {
  const newAttributeKeys = Object.keys(newAttributes);
  Array.from(element.attributes)
    .filter(attr => !newAttributeKeys.includes(attr.name))
    .forEach(attr => {
      // eslint-disable-next-line no-param-reassign
      newAttributes[attr.name] = attr.value;
    });

  return newAttributes;
}

export default class OscdSave extends LitElement {
  constructor() {
    super();

    window.addEventListener('oscd-edit', event =>
      this.handleEditEvent(event as EditEvent)
    );
  }

  handleComplex(edits: Edit[]): void {
    const actions: SimpleAction[] = [];

    edits.flat(Infinity as 1).forEach(edit => {
      if (isInsert(edit)) actions.push(this.insertToCreate(edit));
      if (isUpdate(edit)) actions.push(this.updateToOldUpdate(edit));
      if (isRemove(edit)) {
        const del = this.removeToDelete(edit);
        if (del) actions.push(del);
      }
      // if (isComplex(edit)) this.handleComplex(edit);
    });

    const title = `${actions.length} elements changed`;
    this.dispatchEvent(newActionEvent({ title, actions }));
  }

  updateToOldUpdate({ element, attributes }: Update): OldUpdate {
    const newAttributes = addMissingAttributes(
      element,
      filterNamespacedAttributes(attributes)
    );

    return createUpdateAction(element, newAttributes);
  }

  handleUpdate({ element, attributes }: Update): void {
    const newAttributes = addMissingAttributes(
      element,
      filterNamespacedAttributes(attributes)
    );
    this.dispatchEvent(
      newActionEvent(createUpdateAction(element, newAttributes))
    );
  }

  removeToDelete({ node }: Remove): Delete | null {
    if (node.parentNode) {
      this.dispatchEvent(
        newActionEvent({ old: { parent: node.parentNode, element: node } })
      );
      return { old: { parent: node.parentNode, element: node } };
    }

    return null;
  }

  handleRemove({ node }: Remove): void {
    if (node.parentNode) {
      this.dispatchEvent(
        newActionEvent({ old: { parent: node.parentNode, element: node } })
      );
    }
  }

  insertToCreate({ parent, node, reference }: Insert): Create {
    return { new: { parent, element: node } };
  }

  handleInsert({ parent, node, reference }: Insert): void {
    this.dispatchEvent(newActionEvent({ new: { parent, element: node } }));
  }

  handleEdit(edit: Edit): void {
    if (isInsert(edit)) this.handleInsert(edit);
    if (isUpdate(edit)) this.handleUpdate(edit);
    if (isRemove(edit)) this.handleRemove(edit);
    if (isComplex(edit)) this.handleComplex(edit);
  }

  protected handleEditEvent(event: EditEvent) {
    const edit = event.detail;
    this.handleEdit(edit);
  }

  // eslint-disable-next-line class-methods-use-this
  async run() {
    alert('I am working under the hood. Please do not disturb me like that.');
  }
}
