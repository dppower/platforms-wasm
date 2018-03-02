#include "contact_listener.h"
#include <Box2D/Dynamics/Contacts/b2Contact.h>

ContactListener::ContactListener(Player* player) :
	player_(player)
{
}


ContactListener::~ContactListener()
{
}

void ContactListener::BeginContact(b2Contact * contact)
{
	// Check for colliding below:
	player_->handleJumpContact(contact);
	
	//handle other contacts...
}

void ContactListener::EndContact(b2Contact * contact)
{
	player_->clearJumpContacts(contact);
}
