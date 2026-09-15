"use strict";

(() => {
  if (typeof i_ === "undefined") {
    console.warn("[Tiki Trail] render-fix-v7: classe do jogo nao encontrada");
    return;
  }

  const originalPlayer = i_.prototype.drawPlayer;

  const drawSurfaceCap = (ctx, image, frame, x, y, width, height, capHeight = 60) => {
    if (!__tikiIntegratedReady(image) || width <= 0 || height <= 0) return false;

    const frameCount = 4;
    const sourceWidth = image.naturalWidth / frameCount;
    const sourceHeight = image.naturalHeight;
    const sourceCapHeight = Math.max(1, Math.round(sourceHeight * 0.34));
    const visibleHeight = Math.max(1, Math.min(capHeight, height));
    const tileWidth = Math.max(78, Math.min(116, visibleHeight * 1.55));

    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.clip();
    ctx.imageSmoothingEnabled = false;

    for (let drawX = x; drawX < x + width + 2; drawX += tileWidth) {
      ctx.drawImage(image, sourceWidth * frame, 0, sourceWidth, sourceCapHeight, drawX, y, tileWidth, visibleHeight);
    }

    ctx.restore();
    return true;
  };

  i_.prototype.drawPlayer = function drawPlayerGrounded(ctx) {
    ctx.save();
    ctx.translate(0, 4);
    originalPlayer.call(this, ctx);
    ctx.restore();
  };

  i_.prototype.drawPlatform = function drawPlatformFixed(ctx, platform) {
    __origDrawPlatform.call(this, ctx, platform);
    const frame = platform.kind === "bridge" ? 3 : 0;
    drawSurfaceCap(ctx, __tikiIntegratedSprites.tiles, frame, platform.x, platform.y, platform.width, platform.height, platform.kind === "bridge" ? 52 : 62);
  };

  i_.prototype.drawSwampPlatform = function drawSwampPlatformFixed(ctx, platform) {
    __origDrawSwampPlatform.call(this, ctx, platform);
    drawSurfaceCap(ctx, __tikiIntegratedSprites.tiles, 0, platform.x, platform.y, platform.width, platform.height, 58);
  };

  i_.prototype.drawStormPlatform = function drawStormPlatformFixed(ctx, platform) {
    __origDrawStormPlatform.call(this, ctx, platform);
    drawSurfaceCap(ctx, __tikiIntegratedSprites.tiles, 1, platform.x, platform.y, platform.width, platform.height, 58);
  };

  i_.prototype.drawCavePlatform = function drawCavePlatformFixed(ctx, platform) {
    __origDrawCavePlatform.call(this, ctx, platform);
    drawSurfaceCap(ctx, __tikiIntegratedSprites.tiles, 2, platform.x, platform.y, platform.width, platform.height, 58);
  };

  i_.prototype.drawSpikeTrap = function drawSpikeTrapFixed(ctx, trap) {
    if (!__tikiIntegratedReady(__tikiIntegratedSprites.spike)) {
      return __origDrawSpikeTrap.call(this, ctx, trap);
    }

    const physicalHeight = this.spikeHeight(trap);
    const frame = physicalHeight < 23 ? 0 : physicalHeight < 29 ? 1 : physicalHeight < 36 ? 2 : 3;
    const spriteWidth = Math.max(trap.width + 18, 90);
    const spriteHeight = Math.max(50, Math.min(66, spriteWidth * 0.48));

    __tikiDrawFrame(ctx, __tikiIntegratedSprites.spike, 4, frame, trap.x + trap.width / 2, trap.y + 8, spriteWidth, spriteHeight);
  };

  i_.prototype.drawGuard = function drawGuardGrounded(ctx, enemy) {
    if (!__tikiIntegratedReady(__tikiIntegratedSprites.guard)) {
      return __origDrawGuard.call(this, ctx, enemy);
    }

    const frame = __tikiAnimFrameV2(this, 6, 5, __tikiPhaseV2(enemy) % 6);
    const bob = Math.sin(this.elapsed * 4 + enemy.baseX) * 2;

    ctx.save();
    ctx.fillStyle = "rgba(8,31,37,.18)";
    ctx.beginPath();
    ctx.ellipse(enemy.x, enemy.y + 44 + bob, 23, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    __tikiDrawFrame(ctx, __tikiIntegratedSprites.guard, 6, frame, enemy.x, enemy.y + 48 + bob, 84, 84);
    ctx.restore();
  };

  i_.prototype.drawLanternHunter = function drawLanternHunterGrounded(ctx, enemy) {
    if (!__tikiIntegratedReady(__tikiIntegratedSprites.lanternHunter)) {
      return __origDrawLanternHunter.call(this, ctx, enemy);
    }

    const frame = __tikiAnimFrameV2(this, 6, 5, __tikiPhaseV2(enemy) % 6);

    ctx.save();
    ctx.fillStyle = "rgba(6,31,37,.18)";
    ctx.beginPath();
    ctx.ellipse(enemy.x, enemy.y + 43, 22, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    __tikiDrawFrame(ctx, __tikiIntegratedSprites.lanternHunter, 6, frame, enemy.x + 4, enemy.y + 48, 92, 94);
    ctx.restore();
  };

  console.info("[Tiki Trail] render-fix-v7 ativo");
})();
