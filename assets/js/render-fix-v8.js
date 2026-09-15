"use strict";

(() => {
  if (typeof i_ === "undefined") {
    console.warn("[Tiki Trail] render-fix-v8: classe do jogo nao encontrada");
    return;
  }

  const originalPlayer = i_.prototype.drawPlayer;

  // Corrige o contato visual do personagem com o collider de piso sem mexer na fisica.
  i_.prototype.drawPlayer = function drawPlayerGrounded(ctx) {
    ctx.save();
    ctx.translate(0, 4);
    originalPlayer.call(this, ctx);
    ctx.restore();
  };

  // Remove completamente os tiles grandes que estavam sendo desenhados por cima
  // dos colliders e apareciam como colunas/blocos voando. Mantemos apenas o
  // renderer procedural original, que respeita x/y/width/height reais da plataforma.
  i_.prototype.drawPlatform = function drawPlatformClean(ctx, platform) {
    return __origDrawPlatform.call(this, ctx, platform);
  };

  i_.prototype.drawSwampPlatform = function drawSwampPlatformClean(ctx, platform) {
    return __origDrawSwampPlatform.call(this, ctx, platform);
  };

  i_.prototype.drawStormPlatform = function drawStormPlatformClean(ctx, platform) {
    return __origDrawStormPlatform.call(this, ctx, platform);
  };

  i_.prototype.drawCavePlatform = function drawCavePlatformClean(ctx, platform) {
    return __origDrawCavePlatform.call(this, ctx, platform);
  };

  // A armadilha usa novamente o desenho original baseado em spikeHeight().
  // A base fica exatamente em trap.y e os espinhos crescem para cima, igual ao collider.
  i_.prototype.drawSpikeTrap = function drawSpikeTrapGrounded(ctx, trap) {
    return __origDrawSpikeTrap.call(this, ctx, trap);
  };

  // Mantem os inimigos terrestres visualmente apoiados na linha fisica do chao.
  i_.prototype.drawGuard = function drawGuardGrounded(ctx, enemy) {
    if (!__tikiIntegratedReady(__tikiIntegratedSprites.guard)) {
      return __origDrawGuard.call(this, ctx, enemy);
    }

    const frame = __tikiAnimFrameV2(this, 6, 5, __tikiPhaseV2(enemy) % 6);
    const bob = Math.sin(this.elapsed * 4 + enemy.baseX) * 1.5;

    ctx.save();
    ctx.fillStyle = "rgba(8,31,37,.18)";
    ctx.beginPath();
    ctx.ellipse(enemy.x, enemy.y + 42, 22, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    __tikiDrawFrame(ctx, __tikiIntegratedSprites.guard, 6, frame, enemy.x, enemy.y + 46 + bob, 82, 82);
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
    ctx.ellipse(enemy.x, enemy.y + 42, 21, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    __tikiDrawFrame(ctx, __tikiIntegratedSprites.lanternHunter, 6, frame, enemy.x + 4, enemy.y + 46, 90, 92);
    ctx.restore();
  };

  console.info("[Tiki Trail] render-fix-v8 ativo");
})();
