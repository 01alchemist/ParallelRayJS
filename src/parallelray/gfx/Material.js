System.register([], function(exports_1) {
    var Material;
    return {
        setters:[],
        execute: function() {
            Material = (function () {
                function Material() {
                }
                Material.prototype.getMaterialType = function () {
                    return this.material_type;
                };
                Material.prototype.getColorAmbient = function () {
                    return this.color_ambient;
                };
                Material.prototype.getColorDiffuse = function () {
                    return this.color_diffuse;
                };
                Material.prototype.getColorSpecular = function () {
                    return this.color_specular;
                };
                Material.prototype.getShininess = function () {
                    return this.shininess;
                };
                Material.prototype.getRoughness = function () {
                    return this.roughness;
                };
                Material.prototype.getFresnel = function () {
                    return this.fresnel;
                };
                Material.prototype.getDensity = function () {
                    return this.density;
                };
                Material.prototype.getReflectivity = function () {
                    return this.reflectivity;
                };
                Material.prototype.getRefractivity = function () {
                    return this.refractivity;
                };
                Material.prototype.getIOR = function () {
                    return this.ior;
                };
                return Material;
            })();
            exports_1("Material", Material);
        }
    }
});
//# sourceMappingURL=Material.js.map