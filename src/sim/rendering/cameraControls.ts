import { ArcRotateCamera, Vector3, Scene } from '@babylonjs/core';
import { throttle } from '../../utils/guards';

export function setupCameraControls(camera: ArcRotateCamera, canvas: HTMLCanvasElement): void {
  // Attach camera controls to canvas
  camera.attachToCanvas(canvas);

  // Configure camera behavior
  camera.setTarget(Vector3.Zero());
  camera.alpha = -Math.PI / 2; // Start facing north
  camera.beta = Math.PI / 2.5; // Elevated angle
  camera.radius = 300; // Initial zoom level

  // Camera limits
  camera.lowerBetaLimit = Math.PI / 6; // Don't go too low
  camera.upperBetaLimit = Math.PI / 2.1; // Don't go too high
  camera.lowerRadiusLimit = 50; // Minimum zoom
  camera.upperRadiusLimit = 1000; // Maximum zoom

  // Smooth camera movement
  camera.inertia = 0.9;
  camera.wheelDeltaPercentage = 0.01;
  camera.panningSensibility = 100;

  // Enable panning
  camera.mapPanning = true;
  camera.panningDistanceLimit = 500;
  camera.panningOriginTarget = Vector3.Zero();

  // Custom input handling for better UX
  setupCustomInputs(camera, canvas);
}

function setupCustomInputs(camera: ArcRotateCamera, canvas: HTMLCanvasElement): void {
  let isPointerDown = false;
  let lastPointerX = 0;
  let lastPointerY = 0;
  
  // Throttle camera updates for performance
  const throttledCameraUpdate = throttle(() => {
    // Any additional camera update logic
  }, 16);

  // Pointer down
  const handlePointerDown = (event: PointerEvent) => {
    isPointerDown = true;
    lastPointerX = event.clientX;
    lastPointerY = event.clientY;
    canvas.setPointerCapture(event.pointerId);
    canvas.style.cursor = 'grabbing';
  };

  // Pointer move
  const handlePointerMove = (event: PointerEvent) => {
    if (!isPointerDown) return;

    const deltaX = event.clientX - lastPointerX;
    const deltaY = event.clientY - lastPointerY;

    // Handle different mouse buttons/modifiers
    if (event.shiftKey || event.button === 1) {
      // Pan with shift key or middle mouse
      panCamera(camera, deltaX, deltaY);
    } else if (event.ctrlKey || event.button === 2) {
      // Zoom with ctrl key or right mouse
      zoomCamera(camera, deltaY);
    } else {
      // Default orbit behavior (handled by Babylon.js)
    }

    lastPointerX = event.clientX;
    lastPointerY = event.clientY;
    
    throttledCameraUpdate();
  };

  // Pointer up
  const handlePointerUp = (event: PointerEvent) => {
    isPointerDown = false;
    canvas.releasePointerCapture(event.pointerId);
    canvas.style.cursor = 'grab';
  };

  // Wheel event for zooming
  const handleWheel = (event: WheelEvent) => {
    event.preventDefault();
    const delta = event.deltaY > 0 ? 1 : -1;
    zoomCamera(camera, delta * 20);
  };

  // Keyboard controls
  const handleKeyDown = (event: KeyboardEvent) => {
    const panSpeed = 10;
    const zoomSpeed = 20;

    switch (event.code) {
      case 'KeyW':
      case 'ArrowUp':
        panCamera(camera, 0, -panSpeed);
        break;
      case 'KeyS':
      case 'ArrowDown':
        panCamera(camera, 0, panSpeed);
        break;
      case 'KeyA':
      case 'ArrowLeft':
        panCamera(camera, -panSpeed, 0);
        break;
      case 'KeyD':
      case 'ArrowRight':
        panCamera(camera, panSpeed, 0);
        break;
      case 'KeyQ':
        zoomCamera(camera, -zoomSpeed);
        break;
      case 'KeyE':
        zoomCamera(camera, zoomSpeed);
        break;
      case 'KeyR':
        resetCamera(camera);
        break;
    }
  };

  // Add event listeners
  canvas.addEventListener('pointerdown', handlePointerDown);
  canvas.addEventListener('pointermove', handlePointerMove);
  canvas.addEventListener('pointerup', handlePointerUp);
  canvas.addEventListener('wheel', handleWheel, { passive: false });
  window.addEventListener('keydown', handleKeyDown);

  // Store cleanup function
  (camera as any)._customCleanup = () => {
    canvas.removeEventListener('pointerdown', handlePointerDown);
    canvas.removeEventListener('pointermove', handlePointerMove);
    canvas.removeEventListener('pointerup', handlePointerUp);
    canvas.removeEventListener('wheel', handleWheel);
    window.removeEventListener('keydown', handleKeyDown);
  };
}

function panCamera(camera: ArcRotateCamera, deltaX: number, deltaY: number): void {
  const sensitivity = 0.01;
  const forward = camera.getFrontPosition(1).subtract(camera.position).normalize();
  const right = Vector3.Cross(forward, Vector3.Up()).normalize();

  const panVector = right.scale(deltaX * sensitivity).add(
    Vector3.Up().scale(-deltaY * sensitivity)
  );

  camera.setTarget(camera.getTarget().add(panVector));
}

function zoomCamera(camera: ArcRotateCamera, delta: number): void {
  const zoomSpeed = 0.1;
  const newRadius = camera.radius + (delta * zoomSpeed);
  camera.radius = Math.max(
    camera.lowerRadiusLimit,
    Math.min(camera.upperRadiusLimit, newRadius)
  );
}

function resetCamera(camera: ArcRotateCamera): void {
  camera.setTarget(Vector3.Zero());
  camera.alpha = -Math.PI / 2;
  camera.beta = Math.PI / 2.5;
  camera.radius = 300;
}

// Focus camera on a specific position
export function focusCameraOn(camera: ArcRotateCamera, position: Vector3, smooth: boolean = true): void {
  if (smooth) {
    // Smooth transition to target
    const targetDistance = 100;
    camera.setTarget(position);
    camera.radius = targetDistance;
  } else {
    // Instant focus
    camera.setTarget(position);
  }
}

// Get camera information for minimap and other UI elements
export function getCameraInfo(camera: ArcRotateCamera): {
  position: Vector3;
  target: Vector3;
  radius: number;
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number };
} {
  const target = camera.getTarget();
  const bounds = {
    minX: target.x - camera.radius,
    maxX: target.x + camera.radius,
    minZ: target.z - camera.radius,
    maxZ: target.z + camera.radius,
  };

  return {
    position: camera.position,
    target,
    radius: camera.radius,
    bounds,
  };
}