<script>
  import { onMount, onDestroy } from 'svelte';
  import HoloSphere from 'holosphere';

  let events = [];
  let loading = true;
  let error = null;
  let holoSphere;

  // Liminal Village location (approximate coordinates in Italy)
  const LIMINAL_LAT = 42.9;
  const LIMINAL_LNG = 13.6;
  const RESOLUTION = 7; // City-level resolution

  onMount(async () => {
    try {
      // Initialize HoloSphere for Liminal Village
      holoSphere = new HoloSphere('liminal-village');

      // Get the holon for Liminal Village location
      const holon = await holoSphere.getHolon(LIMINAL_LAT, LIMINAL_LNG, RESOLUTION);

      // Define event schema
      const eventSchema = {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          startDate: { type: 'number' },
          endDate: { type: 'number' },
          location: { type: 'string' },
          organizer: { type: 'string' },
          type: { type: 'string' },
          participants: { type: 'number' },
          timestamp: { type: 'number' }
        },
        required: ['id', 'title', 'startDate', 'location']
      };

      await holoSphere.setSchema('events', eventSchema);

      // Load federated events from the network
      await loadFederatedEvents(holon);

      // Subscribe to real-time updates
      holoSphere.subscribe(holon, 'events', (eventData) => {
        if (eventData && eventData.id) {
          updateEventsList(eventData);
        }
      });

      loading = false;
    } catch (err) {
      console.error('Error initializing events:', err);
      error = 'Failed to load events. Please try again later.';
      loading = false;
    }
  });

  async function loadFederatedEvents(holon) {
    try {
      // Get events from the local holon
      const localEvents = await holoSphere.getAll(holon, 'events');

      // Get events from federated spaces in the network
      const federatedEvents = await holoSphere.getFederated(holon, 'events', {
        resolveHolograms: true,
        idField: 'id'
      });

      // Combine and sort events
      const allEvents = [...Object.values(localEvents || {}), ...Object.values(federatedEvents || {})];
      events = allEvents
        .filter(event => event && event.id)
        .filter(event => event.endDate ? event.endDate > Date.now() : true)
        .sort((a, b) => a.startDate - b.startDate);

    } catch (err) {
      console.error('Error loading federated events:', err);
    }
  }

  function updateEventsList(newEvent) {
    const existingIndex = events.findIndex(e => e.id === newEvent.id);
    if (existingIndex >= 0) {
      events[existingIndex] = newEvent;
    } else {
      events = [...events, newEvent];
    }
    events = events.sort((a, b) => a.startDate - b.startDate);
  }

  function formatDate(timestamp) {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  onDestroy(() => {
    if (holoSphere) {
      holoSphere.close();
    }
  });
</script>

<section id="events" class="events section padding-top">
  <div class="container">
    <div class="section-heading">
      <h2>Network Events</h2>
      <p>Events happening across the Liminal Village network</p>
    </div>

    {#if loading}
      <div class="loading">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading federated events from the network...</p>
      </div>
    {:else if error}
      <div class="error">
        <i class="fas fa-exclamation-circle"></i>
        <p>{error}</p>
      </div>
    {:else if events.length === 0}
      <div class="no-events">
        <i class="fas fa-calendar"></i>
        <p>No upcoming events at the moment. Check back soon!</p>
      </div>
    {:else}
      <div class="events-grid">
        {#each events as event (event.id)}
          <div class="event-card">
            <div class="event-type">{event.type || 'Event'}</div>
            <h3>{event.title}</h3>
            <div class="event-details">
              <div class="detail">
                <i class="fas fa-calendar-alt"></i>
                <span>{formatDate(event.startDate)}</span>
              </div>
              {#if event.location}
                <div class="detail">
                  <i class="fas fa-map-marker-alt"></i>
                  <span>{event.location}</span>
                </div>
              {/if}
              {#if event.organizer}
                <div class="detail">
                  <i class="fas fa-user"></i>
                  <span>{event.organizer}</span>
                </div>
              {/if}
              {#if event.participants}
                <div class="detail">
                  <i class="fas fa-users"></i>
                  <span>{event.participants} participants</span>
                </div>
              {/if}
            </div>
            {#if event.description}
              <p class="event-description">{event.description}</p>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </div>
</section>

<style>
  .events {
    float: left;
    width: 100%;
    background: #f8f9fa;
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

  .loading, .error, .no-events {
    text-align: center;
    padding: 60px 20px;
  }

  .loading i, .error i, .no-events i {
    font-size: 3em;
    color: var(--primary-color);
    margin-bottom: 20px;
  }

  .error i {
    color: #d9534f;
  }

  .events-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 30px;
    margin-top: 30px;
  }

  .event-card {
    background: white;
    padding: 30px;
    border-radius: 0;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    border-top: 3px solid var(--primary-color);
  }

  .event-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.12);
  }

  .event-type {
    display: inline-block;
    background: var(--primary-color);
    color: white;
    padding: 5px 15px;
    font-size: 12px;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 15px;
    font-weight: 600;
  }

  .event-card h3 {
    font-size: 24px;
    color: var(--dark-color);
    margin-bottom: 20px;
    letter-spacing: 2px;
  }

  .event-details {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 15px;
  }

  .detail {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    color: var(--text-color);
    letter-spacing: 1px;
  }

  .detail i {
    color: var(--primary-color);
    font-size: 1em;
    width: 20px;
  }

  .event-description {
    font-size: 14px;
    line-height: 1.7;
    color: #666;
    margin-top: 15px;
    letter-spacing: 1px;
  }

  @media (max-width: 968px) {
    .container {
      padding: 0 50px;
    }

    .section-heading h2 {
      font-size: 40px;
    }

    .events-grid {
      grid-template-columns: 1fr;
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
  }

  @media (max-width: 480px) {
    .section-heading h2 {
      font-size: 28px;
    }

    .event-card {
      padding: 20px;
    }
  }
</style>
