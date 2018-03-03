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
	player_->handleContactBegin(contact);
	
	//handle other contacts...
}

void ContactListener::EndContact(b2Contact * contact)
{
	player_->handleContactEnd(contact);
}

void ContactListener::PreSolve(b2Contact * contact, const b2Manifold * oldManifold)
{
	player_->disableJumpContact(contact);
}
