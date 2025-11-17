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
    background: #2c3e50;
    color: white;
    padding: 2rem 0;
    text-align: center;
    position: relative;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
  }

  p {
    margin: 0;
    font-size: 1rem;
    color: #bdc3c7;
  }

  .back-to-top {
    background: #4a9d5f;
    color: white;
    border: none;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 1.2rem;
  }

  .back-to-top:hover {
    background: #2d7a3e;
    transform: translateY(-3px);
    box-shadow: 0 4px 15px rgba(74, 157, 95, 0.4);
  }

  @media (max-width: 576px) {
    .container {
      flex-direction: column;
      gap: 1rem;
    }
  }
</style>
