import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { SportService } from '../../services/sport.service.js';

function buildRepo() {
  return {
    findTeamById: jest.fn(),
    findSessionById: jest.fn(),
    findMemberById: jest.fn(),
    createSession: jest.fn(),
    addParticipant: jest.fn(),
    createPerformance: jest.fn(),
  };
}

describe('SportService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('converts session date string to Date on createSession', async () => {
    const repo = buildRepo();
    repo.createSession.mockResolvedValue({ id: 's1' });
    repo.findSessionById.mockResolvedValue({ id: 's1' });
    const service = new SportService(repo);

    await service.createSession({
      title: 'Morning',
      type: 'TRAINING',
      date: '2026-04-01T08:00:00.000Z',
      teamId: '550e8400-e29b-41d4-a716-446655440000',
    });

    expect(repo.createSession).toHaveBeenCalledTimes(1);
    const payload = repo.createSession.mock.calls[0][0];
    expect(payload.date).toBeInstanceOf(Date);
  });

  it('validates and checks member existence before addParticipant', async () => {
    const repo = buildRepo();
    repo.findSessionById.mockResolvedValue({ id: 's1' });
    repo.findMemberById.mockResolvedValue({ id: 'm1' });
    repo.addParticipant.mockResolvedValue({ sessionId: 's1', memberId: 'm1' });
    const service = new SportService(repo);

    await service.addParticipant(
      '550e8400-e29b-41d4-a716-446655440000',
      '550e8400-e29b-41d4-a716-446655440001',
    );

    expect(repo.findSessionById).toHaveBeenCalled();
    expect(repo.findMemberById).toHaveBeenCalled();
    expect(repo.addParticipant).toHaveBeenCalled();
  });

  it('converts recordedAt to Date on createPerformance', async () => {
    const repo = buildRepo();
    repo.createPerformance.mockResolvedValue({ id: 'p1' });
    const service = new SportService(repo);

    await service.createPerformance({
      memberId: '550e8400-e29b-41d4-a716-446655440000',
      recordedAt: '2026-04-01T08:00:00.000Z',
      rating: 8,
    });

    const payload = repo.createPerformance.mock.calls[0][0];
    expect(payload.recordedAt).toBeInstanceOf(Date);
  });
});
