function saveEmailLists() {
  var scriptProps = PropertiesService.getScriptProperties();

  scriptProps.setProperty("3dayEmails", JSON.stringify([
    // some email addresses
  ]));

  scriptProps.setProperty("5dayEmails", JSON.stringify([
    // some email addresses
  ]));
}
