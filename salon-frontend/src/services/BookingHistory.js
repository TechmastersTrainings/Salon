const handleOnMyWay = async (appointmentId) => {
  try {
    await axios.patch(`/api/bookings/${appointmentId}/`, { status: 'en_route' });
    toast.success("Barber notified! Drive safely.");
    refreshHistory();
  } catch (error) {
    toast.error("Update failed");
  }
};

// Inside your map function for appointments:
{apt.status === 'confirmed' && (
  <button 
    onClick={() => handleOnMyWay(apt.id)}
    className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold flex items-center"
  >
    <Navigation className="w-4 h-4 mr-2" /> I'm on my way
  </button>
)}