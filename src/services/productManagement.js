"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const ObjectNotFound_1 = __importDefault(require("../errors/ObjectNotFound"));
const models_1 = require("../models");
const helper_1 = require("../system/helper");
const cloudinary_1 = __importDefault(require("./cloudinary"));
const product_1 = __importDefault(require("./product"));
const product_2 = __importDefault(require("../models/product"));
class ProductManagementService {
    jsonImporter(jsonProduct) {
        return __awaiter(this, void 0, void 0, function* () {
            const start = Date.now();
            const foundedProduct = yield product_2.default.findOne({
                where: {
                    name_ascii: (0, helper_1.generateId)(jsonProduct.name),
                },
            });
            if (foundedProduct)
                return;
            /** create product */
            const newProduct = yield new product_2.default({
                brand_id: jsonProduct.brand_id,
                category_id: jsonProduct.category_id,
                name: jsonProduct.name,
                name_ascii: (0, helper_1.generateId)(jsonProduct.name),
                image_url: "",
            }).save();
            /** description */
            yield new models_1.Description({
                content: jsonProduct.description,
                product_id: newProduct.id,
            }).save();
            /** color */
            console.log((Date.now() - start) / 1000 + "s", ">>> Save colors: ");
            const colorSchemas = jsonProduct.colors.map((c) => ({
                name: c,
                name_ascii: (0, helper_1.generateId)(c),
                product_id: newProduct.id,
            }));
            const newColors = yield models_1.Color.bulkCreate(colorSchemas);
            /** variant */
            console.log((Date.now() - start) / 1000 + "s", ">>> Save variant: ");
            const variantSchemas = jsonProduct.variants.map((v) => ({
                product_id: newProduct.id,
                name: v,
                name_ascii: (0, helper_1.generateId)(v),
            }));
            const newVariants = yield models_1.Variant.bulkCreate(variantSchemas);
            console.log((Date.now() - start) / 1000 + "s", ">>> Upload image: ");
            /** slider images */
            const imageRes = yield Promise.all([
                cloudinary_1.default.upload(jsonProduct.image),
                ...jsonProduct.sliders.map((url) => cloudinary_1.default.upload(url)),
            ]);
            console.log((Date.now() - start) / 1000 + "s", ">>> Save image: ");
            const imageSchemas = imageRes.map((res) => ({
                name: Date.now() + "",
                public_id: res.public_id,
                image_url: res.secure_url,
                size: Math.ceil(res.bytes / 1024),
            }));
            const newImages = yield models_1.Image.bulkCreate(imageSchemas);
            const [productImage, ...restImages] = newImages;
            console.log((Date.now() - start) / 1000 + "s", ">>> Update product image: ");
            yield newProduct.set("image_url", productImage.image_url).save();
            console.log((Date.now() - start) / 1000 + "s", ">>> Save slider: ");
            const sliderSchemas = newColors.map((c) => ({
                name: newProduct.name_ascii + "_" + c.name_ascii,
            }));
            const newSliders = yield models_1.Slider.bulkCreate(sliderSchemas);
            console.log((Date.now() - start) / 1000 + "s", ">>> Product slider, ...: ");
            const productSliderSchemas = [];
            for (let index = 0; index < newColors.length; index++) {
                const color = newColors[index];
                const slider = newSliders[index];
                productSliderSchemas.push({
                    color_id: color.id,
                    product_id: newProduct.id,
                    slider_id: slider.id,
                });
            }
            const productSliderProcess = models_1.ProductSlider.bulkCreate(productSliderSchemas);
            /** slider images */
            const sliderImageSchemas = restImages.map((i) => ({
                image_id: i.id,
                link_to: "",
                slider_id: newSliders[0].id,
            }));
            const sliderImageProcess = models_1.SliderImage.bulkCreate(sliderImageSchemas);
            /** attributes */
            const attributeSchemas = jsonProduct.attributes.map((a) => ({
                category_attribute_id: a.category_attribute_id,
                product_id: newProduct.id,
                value: a.value,
            }));
            const attributeProcess = models_1.ProductAttribute.bulkCreate(attributeSchemas);
            /** default variant */
            const defaultVariantProcess = models_1.DefaultProductVariant.create({
                product_id: newProduct.id,
                variant_id: newVariants[0].id,
            });
            yield Promise.all([productSliderProcess, sliderImageProcess, attributeProcess, defaultVariantProcess]);
            console.log((Date.now() - start) / 1000 + "s", ">>> Combine,...: ");
            /** combines */
            const combineSchemas = [];
            for (let i = 0; i < newColors.length; i++) {
                for (let j = 0; j < newVariants.length; j++) {
                    const newCombineSchema = {
                        color_id: newColors[i].id,
                        variant_id: newVariants[j].id,
                        price: jsonProduct.price,
                        product_id: newProduct.id,
                        quantity: 1,
                    };
                    combineSchemas.push(newCombineSchema);
                }
            }
            const newCombines = yield models_1.Combine.bulkCreate(combineSchemas);
            /** default combine */
            yield models_1.DefaultVariantCombine.create({
                variant_id: newVariants[0].id,
                combine_id: newCombines[0].id,
            });
            console.log(">>> Import product successful ", newProduct.name, (Date.now() - start) / 1000 + "s");
            return newProduct;
        });
    }
    duplicate(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const foundedProduct = yield product_1.default.findOne(id);
            if (!foundedProduct)
                throw new ObjectNotFound_1.default("");
            const otherProductNames = yield product_2.default.findAll({
                where: {
                    name_ascii: { [sequelize_1.Op.like]: `${foundedProduct.name_ascii}%` },
                },
            });
            const newProductName = (0, helper_1.getProductName)(otherProductNames.map((p) => p.name), foundedProduct.name);
            const newProduct = yield new product_2.default({
                name: newProductName,
                brand_id: foundedProduct.brand_id,
                category_id: foundedProduct.category_id,
                name_ascii: (0, helper_1.generateId)(newProductName),
                image_url: foundedProduct.image_url,
            }).save();
            //** duplicate product */
            //** description */
            yield new models_1.Description({
                content: newProductName,
                product_id: newProduct.id,
            }).save();
            //** attributes */
            const attributeSchemas = foundedProduct.attributes.map((a) => ({
                category_attribute_id: a.category_attribute_id,
                product_id: newProduct.id,
                value: a.value,
            }));
            yield models_1.ProductAttribute.bulkCreate(attributeSchemas);
            //** colors */
            const colorIdList = foundedProduct.colors.map((c) => c.id);
            const colorSchemas = foundedProduct.colors.map((c) => ({
                name: c.name,
                name_ascii: c.name_ascii,
                product_id: newProduct.id,
            }));
            const newColors = yield models_1.Color.bulkCreate(colorSchemas);
            //** variants */
            const variantIdList = foundedProduct.variants.map((v) => v.id);
            const variantSchemas = foundedProduct.variants.map((c) => ({
                name: c.name,
                name_ascii: c.name_ascii,
                product_id: newProduct.id,
            }));
            const newVariants = yield models_1.Variant.bulkCreate(variantSchemas);
            /** color slider */
            for (let i = 0; i < foundedProduct.colors.length; i++) {
                const color = foundedProduct.colors[i];
                // slider
                const newSlider = yield models_1.Slider.create({
                    name: newProduct.id + color.name,
                });
                // slider images
                const sliderImageSchemas = color.product_slider.slider.slider_images.map((sI) => ({
                    image_id: sI.image_id,
                    link_to: sI.link_to,
                    slider_id: newSlider.id,
                }));
                yield models_1.SliderImage.bulkCreate(sliderImageSchemas);
                // product slider
                yield models_1.ProductSlider.create({
                    color_id: newColors[i].id,
                    product_id: newProduct.id,
                    slider_id: newSlider.id,
                });
            }
            //** combines */
            const combineSchemas = [];
            for (let i = 0; i < newColors.length; i++) {
                const oldColorId = colorIdList[i];
                for (let j = 0; j < newVariants.length; j++) {
                    const oldVariantId = variantIdList[j];
                    const foundedCombine = foundedProduct.combines.find((c) => c.color_id === oldColorId && c.variant_id === oldVariantId);
                    if (!foundedCombine)
                        continue;
                    const newCombineSchema = {
                        color_id: newColors[i].id,
                        variant_id: newVariants[j].id,
                        price: foundedCombine.price,
                        product_id: newProduct.id,
                        quantity: foundedCombine.quantity,
                    };
                    combineSchemas.push(newCombineSchema);
                }
            }
            const newCombines = yield models_1.Combine.bulkCreate(combineSchemas);
            /** default variant */
            // @ts-ignore
            if ((_a = foundedProduct.default_variant) === null || _a === void 0 ? void 0 : _a.variant_id) {
                const indexInList = variantIdList.findIndex(
                // @ts-ignore
                (i) => i === foundedProduct.default_variant.variant_id);
                yield models_1.DefaultProductVariant.create({
                    product_id: newProduct.id,
                    variant_id: newVariants[indexInList].id,
                });
            }
            /** default variant combine */
            for (let i = 0; i < foundedProduct.variants.length; i++) {
                const oldVariant = foundedProduct.variants[i];
                const oldCombine = foundedProduct.combines.find((c) => c.id === oldVariant.default_combine.combine_id);
                // get old combine id
                const oldColorIdIndex = colorIdList.findIndex((i) => i === (oldCombine === null || oldCombine === void 0 ? void 0 : oldCombine.color_id));
                const newCombineIndex = newCombines.findIndex((c) => c.variant_id === newVariants[i].id &&
                    c.color_id ===
                        (!!newColors[oldColorIdIndex] ? newColors[oldColorIdIndex].id : null));
                // must create
                yield models_1.DefaultVariantCombine.create({
                    variant_id: newVariants[i].id,
                    combine_id: (_b = newCombines[newCombineIndex]) === null || _b === void 0 ? void 0 : _b.id,
                });
            }
            return newProduct;
        });
    }
}
exports.default = new ProductManagementService();
