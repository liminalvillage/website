<!-- Slim footer shared by the Svelte sub-pages (lunations, services, apply). -->
<footer class="site-foot">
  <div class="in">
    <span>© {new Date().getFullYear()} Liminal Village · Ascoli Piceno, Italy</span>
    <nav aria-label="More">
      <a href="/frameworks">Frameworks</a>
      <a href="https://docs.liminalvillage.com/" target="_blank" rel="noopener">Docs</a>
      <a href="https://regenerativa.earth" target="_blank" rel="noopener">ReGenerativa</a>
      <a href="/#contact">Contact</a>
    </nav>
  </div>
</footer>

<style>
  .site-foot { margin-top: 48px; padding: 28px 0; border-top: 1px solid #ebe5dc; font-size: 13px; color: #7a746c; }
  .in { max-width: 1160px; margin: 0 auto; padding: 0 24px; display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px 24px; }
  nav { display: flex; flex-wrap: wrap; gap: 18px; }
  a { color: #b8873d; text-decoration: none; }
  a:hover { color: #222; }
  @media (max-width: 640px) { .in { padding: 0 16px; } }
</style>
