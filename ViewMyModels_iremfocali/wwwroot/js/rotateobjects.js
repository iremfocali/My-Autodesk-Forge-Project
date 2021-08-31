class RotateObjects extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this._group = null;
        this._button = null;
        var isActivate = false;
        var fragProxy = null;
    }
    load() {
        console.log('Rotate extension has been loaded');
        return true;
    }
    addEventListener() {
        viewer.addEventListener(Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT, this.onSelected);
       
    }
    onSelected(event) {
        console.log("ROTATE EXTENSION :")
        this.fragProxy = viewer.impl.getFragmentProxy(viewer.model, event.selections[0].fragIdsArray[0]);
        this.fragProxy.getAnimTransform();
        console.log(this.fragProxy)
        this.fragProxy.position = new THREE.Vector3(0, 0, 0);
        this.fragProxy.quaternion = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(1, 0, 0),
            document.getElementById("degreeX").value * Math.PI / 180);
        this.fragProxy.quaternion = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0, 1, 0),
            document.getElementById("degreeY").value * Math.PI / 180);
        this.fragProxy.quaternion = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0, 0, 1),
            document.getElementById("degreeZ").value * Math.PI / 180);
        this.fragProxy.updateAnimTransform();
        viewer.impl.sceneUpdated(true);
    }

    unload() {
        viewer.removeEventListener(Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT, this.onSelected);
        console.log('deactivate');
        // Clean our UI elements if we added any
        if (this._group) {
            this._group.removeControl(this._button);
            if (this._group.getNumberOfControls() === 0) {
                this.viewer.toolbar.removeControl(this._group);
            }
        }
        console.log('RotateObjects has been unloaded');
        return true;
    }

    onToolbarCreated() {
        // Create a new toolbar group if it doesn't exist
        this._group = this.viewer.toolbar.getControl('allRotateObjectsToolbar');
        if (!this._group) {
            this._group = new Autodesk.Viewing.UI.ControlGroup('allRotateObjectsToolbar');
            this.viewer.toolbar.addControl(this._group);
        }

        // Add a new button to the toolbar group
        this._button = new Autodesk.Viewing.UI.Button('RotateObjectsButton');
        this._button.onClick = (ev) => {            
            this.isActivate = !this.isActivate;
            if (this.isActivate) {
                console.log("add")
                this.addEventListener();
            } else {
                console.log("remove")
                viewer.removeEventListener(Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT, this.onSelected);
            }

        };
        this._button.setToolTip('Rotate Objects Extension');
        this._button.addClass('RotateObjectsIcon');
        this._group.addControl(this._button);
    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('iremfocali.RotateObjects', RotateObjects);

