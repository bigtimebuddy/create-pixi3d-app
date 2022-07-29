/// <reference path='../global.d.ts' />

import { Application, Renderer } from 'pixi.js';
import {
    CameraOrbitControl,
    ImageBasedLighting,
    Model,
    LightingEnvironment,
    Light,
    Mesh3D,
    ShadowCastingLight,
    ShadowQuality } from 'pixi3d';

const app = new Application({
    backgroundColor: 0xdddddd,
    resizeTo: window,
    antialias: true,
})
document.body.appendChild(app.view)

const control = new CameraOrbitControl(app.view)

app.loader.add('diffuse', 'assets/chromatic/diffuse.cubemap')
app.loader.add('specular', 'assets/chromatic/specular.cubemap')
app.loader.add('teapot', 'assets/teapot/teapot.gltf')

app.loader.load((_, resources) => {
    LightingEnvironment.main.imageBasedLighting = new ImageBasedLighting(
        resources.diffuse.cubemap,
        resources.specular.cubemap
    )

    const model = app.stage.addChild(Model.from(resources.teapot.gltf))
    model.y = -0.8

    const ground = app.stage.addChild(Mesh3D.createPlane())
    ground.y = -0.8
    ground.scale.set(10, 1, 10)

    const directionalLight = Object.assign(new Light(), {
        intensity: 1,
        type: 'directional'
    })
    directionalLight.rotationQuaternion.setEulerAngles(25, 120, 0)
    LightingEnvironment.main.lights.push(directionalLight)

    const shadowCastingLight = new ShadowCastingLight(
        app.renderer as Renderer,
        directionalLight, {
            shadowTextureSize: 1024,
            quality: ShadowQuality.medium
        })
    shadowCastingLight.softness = 1
    shadowCastingLight.shadowArea = 15

    let pipeline = app.renderer.plugins.pipeline
    pipeline.enableShadows(ground, shadowCastingLight)
    pipeline.enableShadows(model, shadowCastingLight)
})