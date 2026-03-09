async createMessage(threadId, role, content, thinking?) {
  return this.prisma.message.create({
    data: { threadId, role, content, thinking }
  });
}
