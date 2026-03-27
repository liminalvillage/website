<script>
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
</script>

<footer class="footer">
  <div class="container">
    <p>&copy; {new Date().getFullYear()} Liminal Village. All Rights Reserved.</p>
    <button class="back-to-top" on:click={scrollToTop} aria-label="Back to top">
      <i class="fas fa-arrow-up"></i>
    </button>
  </div>
</footer>

<style>
  .footer {
    background: #222;
    color: #8a8274;
    padding: 2rem 0;
    text-align: center;
    position: relative;
  }

  .container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
  }

  p {
    margin: 0;
    font-size: 0.85rem;
    color: #8a8274;
    letter-spacing: 1px;
  }

  .back-to-top {
    background: rgba(214,161,91,0.15);
    color: #D6A15B;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 1rem;
  }

  .back-to-top:hover {
    background: #D6A15B;
    color: #222;
    transform: translateY(-3px);
    box-shadow: 0 4px 15px rgba(214,161,91,0.3);
  }

  @media (max-width: 576px) {
    .container {
      flex-direction: column;
      gap: 1rem;
    }
  }
</style>
