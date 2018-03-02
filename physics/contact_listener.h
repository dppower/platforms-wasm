#pragma once
#include <Box2D/Dynamics/b2WorldCallbacks.h>
#include "player.h"

class ContactListener : public b2ContactListener
{
public:
	ContactListener(Player* player);
	~ContactListener();

	void BeginContact(b2Contact* contact);

	void EndContact(b2Contact* contact);

private:
	Player* player_;
};

