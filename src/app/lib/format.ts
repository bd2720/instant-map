import xmlConverter from 'xml-js';

/** Accepts xml-js non-compacted JSON representation of an XML dataset.
 * Validates the structure and formats into regular JSON to be fully validated and parsed.
 * Returns the formatted structure.
 */
export function formatParsedXML(xmlObject: xmlConverter.Element){
  // get data (array) from root object
  const dataElement = (xmlObject.elements && xmlObject.elements.length === 1) ? xmlObject.elements[0] : null;
  if(!dataElement) throw new Error("Could not identify element containing data while parsing XML.");
  const data = dataElement.elements ?? [];

  // format the data; replace each field's value with its attributes
  const formattedData = data.map(obj => obj.attributes ?? {});

  return formattedData;
}
