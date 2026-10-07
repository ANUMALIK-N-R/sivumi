import { SivumiState } from '../types/database';

interface CompanionResponseResult {
  text: string;
  suggestedAction?: string;
  source: 'offline';
}

/**
 * Offline companion response generator
 * Tailored specially for Sivuu with quiet warmth, calm support, and zero cheesy emoji clutter.
 */
export const generateOfflineCompanionResponse = (
  userMessage: string,
  state: SivumiState
): string => {
  const text = userMessage.toLowerCase().trim();
  const nickname = state.user.nickname || state.user.name || 'Sivu';
  const memories = state.memories;
  const comfortDrink = memories.find(m => m.category === 'comfort' || m.category === 'food')?.details || 'a cup of warm chamomile tea';

  // Check for period / cramps / pain
  if (text.includes('period started') || text.includes('my period') || text.includes('cramps') || text.includes('cramp') || text.includes('bleeding')) {
    const responses = [
      `I am right here with you, ${nickname}. Please rest your body today. If you have your heating pad nearby, plug it in and curl up for a while. Maybe sip on ${comfortDrink}. You do not have to push through anything right now.`,
      `Sending you the gentlest thoughts, ${nickname}. First days can feel so heavy and slow. You have done more than enough—give yourself quiet permission to rest and take it one hour at a time.`,
      `Thank you for checking in with me, ${nickname}. Let us keep today as soft as possible. Dim the lights, keep your feet warm, and take a long, slow breath. Your body is doing hard work today.`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Check for sadness / feeling down / crying
  if (text.includes('sad') || text.includes('cry') || text.includes('unhappy') || text.includes('down') || text.includes('hurts') || text.includes('lonely') || text.includes('low')) {
    const responses = [
      `I hear you, ${nickname}. It is completely fine to feel low, and you do not have to pretend to be cheerful here. Take a slow breath with me. You are safe, and I am right here listening.`,
      `Come rest your mind for a moment, ${nickname}. Some days just feel heavier than others, and that is okay. You do not have to solve everything today. Just take a sip of water and be gentle with yourself.`,
      `You are carrying a lot quietly, ${nickname}. You do not have to hold it all together right now. Take off whatever pressure you put on yourself today and let yourself just breathe.`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Check for tired / exhausted / low energy / sleep
  if (text.includes('tired') || text.includes('exhausted') || text.includes('drained') || text.includes('sleepy') || text.includes('no energy')) {
    const responses = [
      `Listen to your body, ${nickname}. If you are feeling depleted, that is your cue to slow down without guilt. Could you close your eyes for just ten quiet minutes?`,
      `Your worth is never measured by how much you get done today, ${nickname}. If your energy is low, treat yourself like you would a dear friend who needs rest. Soft clothes, warm drink, zero expectations.`,
      `Hormones and long days take their toll, ${nickname}. Unclench your jaw, drop your shoulders away from your ears, and let today be a quiet evening.`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Check for motivation / study / focus
  if (text.includes('motivation') || text.includes('study') || text.includes('focus') || text.includes('procrastinating') || text.includes("can't do this")) {
    const responses = [
      `You do not need a big burst of motivation, ${nickname}—just one tiny, quiet step. What is one small five-minute task we can do together? You have already handled so much.`,
      `Be patient with yourself, ${nickname}. You do not have to finish the entire project in an hour. Just open the page, take a slow breath, and do one small paragraph or problem. I believe in you.`,
      `Small, consistent steps are enough, ${nickname}. Work quietly for fifteen minutes, and then give yourself a comfortable break. You are capable and thoughtful.`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Check for PCOS / bloating / acne / body comfort
  if (text.includes('pcos') || text.includes('bloat') || text.includes('bloated') || text.includes('acne') || text.includes('weight') || text.includes('body')) {
    const responses = [
      `Your body is doing its best for you every single day, ${nickname}. Bloating and skin changes are just reminders that your system needs gentleness, not criticism. Put on something loose and comfortable, and speak kindly to yourself today.`,
      `PCOS symptoms can be so frustrating, ${nickname}. But please remember: you are not broken. Every gentle choice—like drinking water, resting early, or eating balanced nourishment—is an act of care.`,
      `Be tender with yourself in the mirror today, ${nickname}. Hormonal shifts happen, and your value does not change with them. You are safe here.`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Check for food / cravings
  if (text.includes('eat') || text.includes('food') || text.includes('hungry') || text.includes('craving') || text.includes('sugar') || text.includes('sweet')) {
    const responses = [
      `Food is nourishment and energy, ${nickname}. If your body is craving something sweet or comforting, enjoy it peacefully without guilt. Having a little protein or nuts alongside it helps keep your energy steady too.`,
      `Take your time and enjoy your food in peace, ${nickname}. Listen to your hunger and fullness with curiosity rather than rules. Have a glass of water nearby and eat calmly.`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Check for greeting / "just want to talk"
  if (text.includes('just want to talk') || text.includes('talk to me') || text.includes('hello') || text.includes('hey') || text.includes('hi') || text === '') {
    const responses = [
      `I am always here to listen, ${nickname}. Tell me about whatever has been on your mind today—even the small, ordinary things.`,
      `It is so nice to have you here, ${nickname}. How has the day felt so far? Did anything bring you a quiet smile?`,
      `Take your time, ${nickname}. You can write as much or as little as you like. This is your private space.`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Default caring companion response
  const generalComforts = [
    `I hear you, ${nickname}. Thank you for sharing that with me. Just taking a minute to check in with yourself is meaningful. How does your body feel in this moment?`,
    `I am right here with you, ${nickname}. Remember to unclench your jaw and let your breath slow down. Whatever you are navigating, take it one step at a time.`,
    `Whatever today brings, ${nickname}, remember that you are doing enough. Breathe in quietly, and exhale any tension you are holding.`,
    `I am glad you opened this space today, ${nickname}. Even on quiet days, giving your heart a place to rest is important. What would feel most comforting for you right now?`
  ];
  return generalComforts[Math.floor(Math.random() * generalComforts.length)];
};

/**
 * High-level companion query handler
 */
export const querySivumiCompanion = async (
  userMessage: string,
  state: SivumiState
): Promise<CompanionResponseResult> => {
  return {
    text: generateOfflineCompanionResponse(userMessage, state),
    source: 'offline'
  };
};
