<script>
  import { onMount, onDestroy } from 'svelte';
  import HoloSphere from 'holosphere';

  let bookings = [];
  let loading = true;
  let error = null;
  let success = null;
  let holoSphere;
  let submitting = false;

  // Liminal Village location (approximate coordinates in Italy)
  const LIMINAL_LAT = 42.9;
  const LIMINAL_LNG = 13.6;
  const RESOLUTION = 7; // City-level resolution

  // Form data
  let formData = {
    name: '',
    email: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    roomType: 'shared',
    message: ''
  };

  onMount(async () => {
    try {
      // Initialize HoloSphere for Liminal Village
      holoSphere = new HoloSphere('liminal-village');

      // Get the holon for Liminal Village location
      const holon = await holoSphere.getHolon(LIMINAL_LAT, LIMINAL_LNG, RESOLUTION);

      // Define booking schema
      const bookingSchema = {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string' },
          checkIn: { type: 'number' },
          checkOut: { type: 'number' },
          guests: { type: 'number' },
          roomType: { type: 'string' },
          message: { type: 'string' },
          status: { type: 'string' },
          timestamp: { type: 'number' }
        },
        required: ['id', 'name', 'email', 'checkIn', 'checkOut', 'guests', 'roomType']
      };

      await holoSphere.setSchema('bookings', bookingSchema);

      // Load federated bookings from the network
      await loadFederatedBookings(holon);

      // Subscribe to real-time updates
      holoSphere.subscribe(holon, 'bookings', (bookingData) => {
        if (bookingData && bookingData.id) {
          updateBookingsList(bookingData);
        }
      });

      loading = false;
    } catch (err) {
      console.error('Error initializing bookings:', err);
      error = 'Failed to load booking system. Please try again later.';
      loading = false;
    }
  });

  async function loadFederatedBookings(holon) {
    try {
      // Get bookings from the local holon
      const localBookings = await holoSphere.getAll(holon, 'bookings');

      // Get bookings from federated spaces in the network
      const federatedBookings = await holoSphere.getFederated(holon, 'bookings', {
        resolveHolograms: true,
        idField: 'id'
      });

      // Combine and sort bookings
      const allBookings = [...Object.values(localBookings || {}), ...Object.values(federatedBookings || {})];
      bookings = allBookings
        .filter(booking => booking && booking.id)
        .filter(booking => booking.status === 'pending' || booking.status === 'confirmed')
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 5); // Show only latest 5

    } catch (err) {
      console.error('Error loading federated bookings:', err);
    }
  }

  function updateBookingsList(newBooking) {
    const existingIndex = bookings.findIndex(b => b.id === newBooking.id);
    if (existingIndex >= 0) {
      bookings[existingIndex] = newBooking;
    } else {
      bookings = [newBooking, ...bookings].slice(0, 5);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (submitting) return;

    error = null;
    success = null;
    submitting = true;

    try {
      const holon = await holoSphere.getHolon(LIMINAL_LAT, LIMINAL_LNG, RESOLUTION);

      const booking = {
        id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: formData.name,
        email: formData.email,
        checkIn: new Date(formData.checkIn).getTime(),
        checkOut: new Date(formData.checkOut).getTime(),
        guests: parseInt(formData.guests),
        roomType: formData.roomType,
        message: formData.message,
        status: 'pending',
        timestamp: Date.now()
      };

      await holoSphere.put(holon, 'bookings', booking);

      // Propagate to federated spaces
      await holoSphere.propagate(holon, 'bookings', booking, {
        useReferences: true
      });

      success = 'Booking request submitted successfully! We will contact you soon.';

      // Reset form
      formData = {
        name: '',
        email: '',
        checkIn: '',
        checkOut: '',
        guests: 1,
        roomType: 'shared',
        message: ''
      };

      submitting = false;
    } catch (err) {
      console.error('Error submitting booking:', err);
      error = 'Failed to submit booking. Please try again.';
      submitting = false;
    }
  }

  function formatDate(timestamp) {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  function getMinDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  onDestroy(() => {
    if (holoSphere) {
      holoSphere.close();
    }
  });
</script>

<section id="booking" class="booking section padding-top">
  <div class="container">
    <div class="section-heading">
      <h2>Book Your Stay</h2>
      <p>Join us at Liminal Village - requests are processed through our federated network</p>
    </div>

    {#if loading}
      <div class="loading">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading booking system...</p>
      </div>
    {:else}
      <div class="booking-layout">
        <div class="booking-form-container">
          <h3>Request a Booking</h3>

          {#if error}
            <div class="alert alert-error">
              <i class="fas fa-exclamation-circle"></i>
              <span>{error}</span>
            </div>
          {/if}

          {#if success}
            <div class="alert alert-success">
              <i class="fas fa-check-circle"></i>
              <span>{success}</span>
            </div>
          {/if}

          <form on:submit={handleSubmit}>
            <div class="form-group">
              <label for="name">Name *</label>
              <input
                type="text"
                id="name"
                bind:value={formData.name}
                required
                placeholder="Your full name"
              />
            </div>

            <div class="form-group">
              <label for="email">Email *</label>
              <input
                type="email"
                id="email"
                bind:value={formData.email}
                required
                placeholder="your.email@example.com"
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="checkIn">Check-in Date *</label>
                <input
                  type="date"
                  id="checkIn"
                  bind:value={formData.checkIn}
                  min={getMinDate()}
                  required
                />
              </div>

              <div class="form-group">
                <label for="checkOut">Check-out Date *</label>
                <input
                  type="date"
                  id="checkOut"
                  bind:value={formData.checkOut}
                  min={formData.checkIn || getMinDate()}
                  required
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="guests">Number of Guests *</label>
                <input
                  type="number"
                  id="guests"
                  bind:value={formData.guests}
                  min="1"
                  max="20"
                  required
                />
              </div>

              <div class="form-group">
                <label for="roomType">Accommodation Type *</label>
                <select id="roomType" bind:value={formData.roomType} required>
                  <option value="shared">Shared Room</option>
                  <option value="private">Private Room</option>
                  <option value="tent">Camping/Tent</option>
                  <option value="van">Van/RV Spot</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label for="message">Message (Optional)</label>
              <textarea
                id="message"
                bind:value={formData.message}
                rows="4"
                placeholder="Tell us about your visit, dietary requirements, or any special requests..."
              ></textarea>
            </div>

            <button type="submit" class="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Booking Request'}
            </button>
          </form>
        </div>

        <div class="recent-bookings">
          <h3>Recent Booking Requests</h3>
          {#if bookings.length === 0}
            <p class="no-bookings">No recent bookings in the network</p>
          {:else}
            <div class="bookings-list">
              {#each bookings as booking (booking.id)}
                <div class="booking-item">
                  <div class="booking-header">
                    <span class="booking-name">{booking.name}</span>
                    <span class="booking-status status-{booking.status}">{booking.status}</span>
                  </div>
                  <div class="booking-details">
                    <div class="detail">
                      <i class="fas fa-calendar"></i>
                      <span>{formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}</span>
                    </div>
                    <div class="detail">
                      <i class="fas fa-users"></i>
                      <span>{booking.guests} guest{booking.guests > 1 ? 's' : ''}</span>
                    </div>
                    <div class="detail">
                      <i class="fas fa-bed"></i>
                      <span>{booking.roomType}</span>
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</section>

<style>
  .booking {
    float: left;
    width: 100%;
    background: #fff;
  }

  .padding-top {
    padding-top: 100px;
    padding-bottom: 100px;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 100px;
  }

  .section-heading {
    text-align: center;
    margin-bottom: 50px;
  }

  .section-heading h2 {
    font-size: 50px;
    letter-spacing: 5px;
    color: var(--text-color);
    font-weight: 400;
    margin-bottom: 10px;
  }

  .section-heading p {
    font-size: 16px;
    color: var(--text-color);
    font-style: italic;
    letter-spacing: 1px;
  }

  .loading {
    text-align: center;
    padding: 60px 20px;
  }

  .loading i {
    font-size: 3em;
    color: var(--primary-color);
    margin-bottom: 20px;
  }

  .booking-layout {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 50px;
    margin-top: 30px;
  }

  .booking-form-container h3,
  .recent-bookings h3 {
    font-size: 24px;
    letter-spacing: 3px;
    color: var(--dark-color);
    margin-bottom: 30px;
    font-weight: 400;
  }

  .alert {
    padding: 15px 20px;
    margin-bottom: 20px;
    border-radius: 0;
    display: flex;
    align-items: center;
    gap: 10px;
    letter-spacing: 1px;
  }

  .alert-error {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }

  .alert-success {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }

  form {
    background: #f8f9fa;
    padding: 30px;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 1px;
    color: var(--dark-color);
    text-transform: uppercase;
  }

  input,
  select,
  textarea {
    width: 100%;
    padding: 12px 15px;
    border: 2px solid #ddd;
    border-radius: 0;
    font-size: 14px;
    font-family: "Open Sans", sans-serif;
    letter-spacing: 1px;
    transition: border-color 0.3s;
  }

  input:focus,
  select:focus,
  textarea:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  textarea {
    resize: vertical;
  }

  .btn {
    display: inline-block;
    padding: 15px 40px;
    background: var(--primary-color);
    color: var(--dark-color);
    text-decoration: none;
    font-weight: 600;
    font-size: 14px;
    letter-spacing: 3px;
    text-transform: uppercase;
    border-radius: 0;
    border: 2px solid var(--primary-color);
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100%;
    margin-top: 10px;
  }

  .btn:hover:not(:disabled) {
    background: transparent;
    color: var(--primary-color);
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .recent-bookings {
    background: #f8f9fa;
    padding: 30px;
    height: fit-content;
  }

  .no-bookings {
    text-align: center;
    color: #666;
    font-style: italic;
    padding: 20px;
  }

  .bookings-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .booking-item {
    background: white;
    padding: 20px;
    border-left: 3px solid var(--primary-color);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .booking-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }

  .booking-name {
    font-weight: 600;
    font-size: 16px;
    letter-spacing: 1px;
    color: var(--dark-color);
  }

  .booking-status {
    font-size: 11px;
    padding: 4px 10px;
    border-radius: 3px;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 600;
  }

  .status-pending {
    background: #fff3cd;
    color: #856404;
  }

  .status-confirmed {
    background: #d4edda;
    color: #155724;
  }

  .booking-details {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .detail {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: var(--text-color);
    letter-spacing: 1px;
  }

  .detail i {
    color: var(--primary-color);
    font-size: 0.9em;
    width: 16px;
  }

  @media (max-width: 968px) {
    .container {
      padding: 0 50px;
    }

    .section-heading h2 {
      font-size: 40px;
    }

    .booking-layout {
      gap: 30px;
    }
  }

  @media (max-width: 768px) {
    .padding-top {
      padding-top: 80px;
      padding-bottom: 80px;
    }

    .container {
      padding: 0 30px;
    }

    .section-heading h2 {
      font-size: 35px;
      letter-spacing: 3px;
    }

    .booking-layout {
      grid-template-columns: 1fr;
      gap: 40px;
    }

    .form-row {
      grid-template-columns: 1fr;
    }

    form,
    .recent-bookings {
      padding: 20px;
    }
  }

  @media (max-width: 480px) {
    .section-heading h2 {
      font-size: 28px;
    }

    .booking-form-container h3,
    .recent-bookings h3 {
      font-size: 20px;
    }

    .booking-item {
      padding: 15px;
    }
  }
</style>
