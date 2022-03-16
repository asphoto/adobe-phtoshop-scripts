// Get all the layers that are tagged green, make them the only visible green layer, and export as a .tif

// Get the currently opened document
var activeDoc = app.activeDocument;

// Get the document name and then strip out everything after the first underscore
var activeDocName = activeDoc.name;
var activeDocNameWithoutSuffix = activeDocName.substr(0, activeDocName.indexOf('_'));

// If nothing was returned, that means there wasn't an underscore
if(activeDocNameWithoutSuffix == undefined || activeDocNameWithoutSuffix == ''){
    activeDocNameWithoutSuffix = activeDocName;
}

// Get all the layers
var layers = activeDoc.layers;

// Loop through each layer and find the ones with the green tag
var greenLayerTag = 'grain';
var greenLayers = getLayersByColourTag(layers, greenLayerTag);

// Go through each green layer, make them the only one visible, and save that as an individual tiff
for(i = 0; i < greenLayers.length; i++){
    // Ensure each layer is not visible
    for(j = 0; j < greenLayers.length; j++){
        greenLayers[j].visible = false;
    }

    // Set this layer to visible
    greenLayers[i].visible = true;

    // Get the name of the layer since that represents the colour we're modifying
    var colourName = greenLayers[i].name;
    var outputFilePath = activeDoc.path + '/' + activeDocNameWithoutSuffix + colourName + '.tif';

    var activeDocAsTiff = new File(outputFilePath);
    var tiffSaveOptions = new TiffSaveOptions();
    var saveAsCopy = true;
    // TODO - Set assorted TIFF options

    activeDoc.saveAs(activeDocAsTiff, tiffSaveOptions, saveAsCopy, Extension.LOWERCASE);
}

function getLayerColourByID( ID ) {
    var ref = new ActionReference();

    ref.putProperty( charIDToTypeID("Prpr") ,stringIDToTypeID('color'));
    ref.putIdentifier(charIDToTypeID( "Lyr " ), ID );

    return typeIDToStringID(executeActionGet(ref).getEnumerationValue(stringIDToTypeID('color')));
};

function getLayersByColourTag( layers, colourTag ){
    var layersWithColourTag = [];

    for(i = 0; i < layers.length; i++){
        if(getLayerColourByID(layers[i].id) == colourTag){
            layersWithColourTag.push(layers[i]);
        }
    }

    return layersWithColourTag;
}