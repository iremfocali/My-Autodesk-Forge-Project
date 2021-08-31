function loadModel(viewer, options) {
    Autodesk.Viewing.Extension.call(this, viewer, options);
    this.panel = null;
}

loadModel.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
loadModel.prototype.constructor = loadModel;

loadModel.prototype.load = function () {
    console.log('Load Model Extension has been loaded');
    if (this.viewer.toolbar) {
        // Toolbar is already available, create the UI
        this.createUI();
    } else {
        // Toolbar hasn't been created yet, wait until we get notification of its creation
        this.onToolbarCreatedBinded = this.onToolbarCreated.bind(this);
        this.viewer.addEventListener(Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT, this.onToolbarCreatedBinded);
    }
    return true;
};

loadModel.prototype.onToolbarCreated = function () {
    this.viewer.removeEventListener(Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT, this.onToolbarCreatedBinded);
    this.onToolbarCreatedBinded = null;
    this.createUI();
};

loadModel.prototype.createUI = function () {
    var viewer = this.viewer;
    // button to show the docking panel
    var toolbarButtonShowDockingPanel = new Autodesk.Viewing.UI.Button('loadModelExtensionPanel');
    toolbarButtonShowDockingPanel.onClick = function (e) {
        document.addEventListener("click", handleButtonDown);
        console.log("Load Extension:")
        this.isActivate = !this.isActivate;
        if (this.isActivate) {
            console.log("add")
            this.addEventListener();

        } else {
            console.log("remove")
            document.removeEventListener("click",handleButtonDown);
            viewer.removeEventListener(Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT, this.onToolbarCreatedBinded);
        }
    };

    toolbarButtonShowDockingPanel.addClass('loadmodelextensionIcon');
    toolbarButtonShowDockingPanel.setToolTip('Load Model Extension');

    // SubToolbar
    this.subToolbar = new Autodesk.Viewing.UI.ControlGroup('LoadModelExtensionToolbar');
    this.subToolbar.addControl(toolbarButtonShowDockingPanel);

    viewer.toolbar.addControl(this.subToolbar);
};


this.handleButtonDown = async function (event) {

    let res = viewer.impl.hitTest(event.clientX, event.clientY, true, null, [viewer.model.getModelId()]);
    let pt = null;
    let extraZ = null;

    if (res) {
        pt = res.intersectPoint;
    } else {
        pt = viewer.impl.intersectGround(event.clientX, event.clientY);
    }
  
     Autodesk.Viewing.Document.load(`urn:${"dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bW9kZWxzX2lyZW1mb2NhbGkvQ3lsaW5kZXIuaXB0"}`, (doc) => {
        let items = doc.getRoot().search({
            'type': 'geometry',
            'role': '3d'
        }, true);
        if (items.length === 0) {
            console.error('Document contains no viewables.');
            return;
        }

        viewer.loadDocumentNode(doc, items[0], { keepCurrentModels: true }).then(function (model2) {
            let bb = model2.getBoundingBox();
            extraZ = bb.max.z;

            let tr =  model2.getPlacementTransform();
            tr.elements[12] = pt.x;
            tr.elements[13] = pt.y;
            tr.elements[14] = pt.z + extraZ;
            model2.setPlacementTransform(tr);
            viewer.impl.invalidate(true, true, true);
        });

    });

}

loadModel.prototype.unload = function () {
    this.viewer.toolbar.removeControl(this.subToolbar);
    return true;
};

Autodesk.Viewing.theExtensionManager.registerExtension('iremf.loadModel', loadModel);


 //"dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bW9kZWxzX2lyZW1mb2NhbGkvQ3lsaW5kZXIuaXB0" CYLINDER 